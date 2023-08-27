import { ShopModel } from '@src/types/shop-model';
import dayjs from 'dayjs';
import { Document, WithId } from 'mongodb';
import { getShopProductsCollection, getShopsCollection } from './collections';

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

export function projectPopulate(): Document {
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
            array: '$$array',
            total: {
              $map: {
                input: '$$array',
                as: 'product',
                in: {
                  url: '$$product.url',
                  sales: '$$product.totalSales',
                  turnover: {
                    $multiply: ['$$product.price', '$$product.totalSales'],
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

export function projectClean(): Document {
  const document = {
    $project: {
      _id: 0,
      sales: 0,
      products: {
        _id: 0,
        shopId: 0,
      },
    },
  };

  return document;
}
export const computeProductsSalesAndTurnover = async (
  shop: WithId<ShopModel>
) => {
  const { url } = shop;
  const last7Days = dayjs().subtract(7, 'day').startOf('day').unix();

  const shopsCollection = getShopsCollection();
  const data = await shopsCollection
    .aggregate([
      {
        $match: { url },
      },
      ...[lookupProducts(), lookupSales(last7Days), projectPopulate()],
      projectClean(),
    ])
    .toArray();

  const productsCollection = getShopProductsCollection();
  const products = data[0].products.total;

  for (let index = 0; index < products.length; index += 10) {
    const promises = [];

    for (let i = 0; i < 10; i++) {
      const product = products[index + i];

      if (product) {
        promises.push(
          productsCollection.updateOne(
            { url: product.url },
            {
              $set: {
                last7DaysSales: product.sales,
                last7DaysTurnover: product.turnover,
              },
            }
          )
        );
      }
    }
    await Promise.all(promises);
  }
};
