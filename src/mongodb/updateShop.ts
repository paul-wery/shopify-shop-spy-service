import { ShopModel, ShopStatus } from '@src/types/shop-model';
import { ShopProductSaleModel } from '@src/types/shop-product-sales-model';
import { WithId } from 'mongodb';
import {
  getShopProductSalesCollection,
  getShopProductsCollection,
  getShopsCollection,
} from './collections';
import { ShopProductModel } from '@src/types/shop-product-model';

export async function updateShopStatus(
  shop: WithId<ShopModel>,
  status: ShopStatus
) {
  const shopsCollection = getShopsCollection();

  await shopsCollection.updateOne({ _id: shop._id }, { $set: { status } });
}

export async function updateShop(
  shop: WithId<ShopModel>,
  products: ShopProductModel[],
  sales: ShopProductSaleModel[]
) {
  try {
    const shopsCollection = getShopsCollection();
    const productsCollection = getShopProductsCollection();
    const salesCollection = getShopProductSalesCollection();

    await shopsCollection.updateOne({ _id: shop._id }, { $set: shop });

    await productsCollection.bulkWrite(
      products.map((product) => {
        return {
          updateOne: {
            filter: {
              shopId: product.shopId,
              url: product.url,
            },
            update: {
              $set: product,
            },
            upsert: true,
          },
        };
      })
    );
    await salesCollection.bulkWrite(
      sales.map((sale) => {
        return {
          updateOne: {
            filter: {
              shopId: sale.shopId,
              productUrl: sale.productUrl,
              date: sale.date,
            },
            update: {
              $set: {
                shopId: sale.shopId,
                productUrl: sale.productUrl,
                date: sale.date,
              },
              $inc: { count: sale.count },
            },
            upsert: true,
          },
        };
      })
    );
  } catch (error) {
    console.error(error.message);
  }
}
