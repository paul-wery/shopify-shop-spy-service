import { ShopModel } from '@src/types/shop-model';
import dayjs from 'dayjs';
import { Document, WithId } from 'mongodb';
import { getShopsCollection } from './collections';

export function lookupProducts(): Document {
  const document = {
    $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: 'shopId',
      as: 'products',
    },
  };

  return document;
}

export function lookupSales(from: number, to?: number): Document {
  const document = {
    $lookup: {
      from: 'sales',
      localField: 'products.url',
      foreignField: 'productUrl',
      let: { shopId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$shopId', '$$shopId'] },
                { $gte: ['$date', from] },
                ...(to ? [{ $lte: ['$date', to] }] : []),
              ],
            },
          },
        },
        {
          $sort: { date: 1 },
        },
      ],
      as: 'sales',
    },
  };

  return document;
}

export function projectPopulate(productsLimit: number): Document {
  const document = {
    $project: {
      id: {
        $toString: '$_id',
      },
      url: 1,
      name: 1,
      logo: 1,
      about: 1,
      currency: 1,
      theme: 1,
      sales: 1,
      createdAt: 1,
      products: {
        $let: {
          vars: {
            array: {
              $sortArray: {
                input: {
                  $map: {
                    input: '$products',
                    as: 'product',
                    in: {
                      $let: {
                        vars: {
                          sales: {
                            $filter: {
                              input: '$sales',
                              as: 'sale',
                              cond: {
                                $eq: ['$$sale.productUrl', '$$product.url'],
                              },
                            },
                          },
                        },
                        in: {
                          url: '$$product.url',
                          name: '$$product.name',
                          image: '$$product.image',
                          price: '$$product.price',
                          createdAt: '$$product.createdAt',
                          sales: '$$sales',
                          totalSales: {
                            $reduce: {
                              input: '$$sales',
                              initialValue: 0,
                              in: { $add: ['$$value', '$$this.count'] },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                sortBy: { totalSales: -1 },
              },
            },
          },
          in: {
            array: { $slice: ['$$array', productsLimit] },
            total: {
              $reduce: {
                input: '$$array',
                initialValue: { sales: 0, turnover: 0 },
                in: {
                  sales: {
                    $add: ['$$value.sales', '$$this.totalSales'],
                  },
                  turnover: {
                    $add: [
                      '$$value.turnover',
                      { $multiply: ['$$this.price', '$$this.totalSales'] },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return document;
}

interface ProjectCleanProps {
  removeProductsArray?: boolean;
}

export function projectClean({
  removeProductsArray = false,
}: ProjectCleanProps = {}): Document {
  const document = {
    $project: {
      _id: 0,
      sales: 0,
      products: {
        _id: 0,
        shopId: 0,
        array: removeProductsArray
          ? 0
          : {
              sales: {
                _id: 0,
                shopId: 0,
                productUrl: 0,
              },
            },
      },
    },
  };

  return document;
}

export const computeSalesAndTurnover = async (shop: WithId<ShopModel>) => {
  const { url, updatedAt } = shop;

  const timeSinceLastUpdate = dayjs().diff(dayjs.unix(updatedAt), 'h');
  const shouldUpdateProductsTotal = !updatedAt || timeSinceLastUpdate >= 1;

  if (!shouldUpdateProductsTotal) return;

  const shopsCollection = getShopsCollection();
  const data = await shopsCollection
    .aggregate([
      {
        $match: { url },
      },
      ...[lookupProducts(), lookupSales(updatedAt), projectPopulate(0)],
      projectClean({ removeProductsArray: true }),
    ])
    .toArray();

  const shopData = data[0] as ShopModel;

  shop.turnover += shopData.products?.total.turnover || 0;
  shop.sales += shopData.products?.total.sales || 0;
  shop.updatedAt = dayjs().unix();

  await shopsCollection.updateOne({ _id: shop._id }, { $set: shop });
};
