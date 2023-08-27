import configuration from '@src/configuration';
import { updateShopStatus } from '@src/mongodb/updateShop';
import { poolRequest } from '@src/proxy/index';
import { ShopifyProduct } from '@src/types/index';
import { ShopModel, ShopStatus } from '@src/types/shop-model';
import { WithId } from 'mongodb';

// LIMIT BY PAGE FOR SHOPIFY API
const LIMIT_BY_PAGE = 250;
const MAX_SHOP_PRODUCTS = configuration.limits.maxShopProducts;
const PAGE_LIMIT = MAX_SHOP_PRODUCTS / LIMIT_BY_PAGE;

const average: Record<string, number> = {};

async function handleExceedLimit(
  shop: WithId<ShopModel>,
  products: ShopifyProduct[]
) {
  if (products.length >= MAX_SHOP_PRODUCTS) {
    await updateShopStatus(shop, ShopStatus.OUT_OF_LIMIT);
    return [];
  }
  return products;
}

export const getShopProducts = async (shop: WithId<ShopModel>) => {
  const url = shop.url;
  const products: ShopifyProduct[] = [];

  let limitReached = false;
  let page = 1;

  while (!limitReached && page <= PAGE_LIMIT) {
    const response = await poolRequest.get(
      `${url}/products.json?page=${page}&limit=${LIMIT_BY_PAGE}`
    );
    const _products: ShopifyProduct[] = response.data.products;

    products.push(..._products);
    page++;
    if (_products.length < LIMIT_BY_PAGE) limitReached = true;
  }
  // console.info(
  //   `[ ${url} ] : ${products.length} products / rounded to ${
  //     (page - 1) * LIMIT_BY_PAGE
  //   } products`
  // );
  average[url] = (page - 1) * LIMIT_BY_PAGE;
  // console.info(
  //   'Average : ',
  //   Object.values(average).reduce((a, b) => a + b, 0) /
  //     Object.values(average).length
  // );

  return handleExceedLimit(shop, products);
};
