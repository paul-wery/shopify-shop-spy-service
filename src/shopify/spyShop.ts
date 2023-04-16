import { updateShop } from '@src/mongodb/updateShop';
import { ShopifyProduct } from '@src/types';
import { ShopModel } from '@src/types/shop-model';
import { ShopProductModel } from '@src/types/shop-product-model';
import dayjs from 'dayjs';
import { WithId } from 'mongodb';
import { getShopProducts } from './getShopProducts';

function defaultProductFromShopifyProduct(product: ShopifyProduct) {
  return {
    url: product.handle,
    name: product.title,
    image: product.images[0]?.src,
    price: parseFloat(product.variants[0].price),
    createdAt: dayjs(product.published_at).unix(),
    lastSaleAt: 0,
    sales: [],
  };
}

const updateProductSalesData = async (
  shopifyProduct: ShopifyProduct,
  product: ShopProductModel,
  currentTime: number
) => {
  const variants = shopifyProduct.variants;
  const lastCount = product.sales[product.sales.length - 1].count;

  if (lastCount === -1) {
    product.sales[product.sales.length - 1].count = 0;
  } else {
    for (const variant of variants) {
      if (product.lastSaleAt < dayjs(variant.updated_at).unix()) {
        product.sales[product.sales.length - 1].count += 1;
      }
    }
  }
  product.lastSaleAt = currentTime;
  return product;
};

async function createMissingOrUpdateProducts(shop: WithId<ShopModel>) {
  const shopProducts: ShopProductModel[] = [];
  const shopifyProducts = await getShopProducts(shop.url);
  const currentTime = dayjs().unix();
  const currentHour = dayjs().startOf('hour').unix();

  for (let index = 0; index < shopifyProducts.length; index++) {
    const shopifyProduct = shopifyProducts[index];
    const shopProduct = shop.products.find(
      (product) => product.url === shopifyProduct.handle
    );
    const defaultShopProduct = defaultProductFromShopifyProduct(shopifyProduct);

    if (shopProduct) {
      defaultShopProduct.lastSaleAt = shopProduct.lastSaleAt;
      defaultShopProduct.sales = shopProduct.sales;
    } else {
      defaultShopProduct.sales = [{ date: currentHour, count: -1 }];
    }

    const lastSale =
      defaultShopProduct.sales[defaultShopProduct.sales.length - 1];

    if (lastSale.date !== currentHour) {
      defaultShopProduct.sales.push({ date: currentHour, count: 0 });
    }
    await updateProductSalesData(
      shopifyProduct,
      defaultShopProduct,
      currentTime
    );
    shopProducts.push(defaultShopProduct);
  }
  shop.products = shopProducts;
}

export async function spyShop(shop: WithId<ShopModel>) {
  try {
    shop.products = shop.products || [];
    console.log('START', shop.url);
    await createMissingOrUpdateProducts(shop);
    console.log('END', shop.url);
    await updateShop(shop);
  } catch (error) {
    console.error(`Catched error on shop ${shop.url}`, error.message);
  }
}
