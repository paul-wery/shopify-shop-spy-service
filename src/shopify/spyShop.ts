import { updateShop } from '@src/mongodb/updateShop';
import { ShopifyProduct } from '@src/types';
import { ShopModel } from '@src/types/shop-model';
import { ShopProductModel } from '@src/types/shop-product-model';
import dayjs from 'dayjs';
import { ObjectId, WithId } from 'mongodb';
import { getShopProducts } from './getShopProducts';
import { ShopProductSaleModel } from '@src/types/shop-product-sales-model';
import { getShopsCollection } from '@src/mongodb/collections';

function shopifyProductToProductModel(
  shopId: ObjectId,
  product: ShopifyProduct
): ShopProductModel {
  return {
    shopId,
    url: product.handle,
    name: product.title,
    image: product.images[0]?.src,
    price: parseFloat(product.variants[0].price),
    createdAt: dayjs(product.published_at).unix(),
  };
}

const updateProductSalesData = (
  shop: WithId<ShopModel>,
  shopifyProduct: ShopifyProduct,
  currentHour: number
): ShopProductSaleModel => {
  const variants = shopifyProduct.variants;
  let count = 0;

  if (shop.lastUpdate) {
    for (const variant of variants) {
      if (shop.lastUpdate < dayjs(variant.updated_at).unix()) {
        count += 1;
      }
    }
  }
  return {
    shopId: shop._id,
    productUrl: shopifyProduct.handle,
    count,
    date: currentHour,
  };
};

async function createMissingOrUpdateProducts(shop: WithId<ShopModel>) {
  const shopifyProducts = await getShopProducts(shop);
  const currentTime = dayjs().unix();
  const currentHour = dayjs().startOf('hour').unix();
  const products: ShopProductModel[] = [];
  const sales: ShopProductSaleModel[] = [];

  for (let index = 0; index < shopifyProducts.length; index++) {
    const shopifyProduct = shopifyProducts[index];
    const newSale = updateProductSalesData(shop, shopifyProduct, currentHour);

    if (newSale.count > 0) {
      sales.push(newSale);
      products.push(shopifyProductToProductModel(shop._id, shopifyProduct));
    }
  }
  if (!shop.lastUpdate) {
    const shopsCollection = getShopsCollection();

    await shopsCollection.updateOne(
      { _id: shop._id },
      { $set: { lastUpdate: currentTime } }
    );
  } else if (sales.length > 0) {
    shop.lastUpdate = currentTime;
    await updateShop(shop, products, sales);
  }
}

export async function spyShop(shop: WithId<ShopModel>) {
  try {
    console.log('START', shop.url);
    await createMissingOrUpdateProducts(shop);
    console.log('END', shop.url);
  } catch (error) {
    console.error(`Catched error on shop ${shop.url}`, error.message);
  }
}
