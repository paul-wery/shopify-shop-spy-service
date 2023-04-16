import { ShopifyProduct } from '@src/types/index';
import axios from 'axios';

// LIMIT BY PAGE FOR SHOPIFY API
const LIMIT_BY_PAGE = 250;

export const getShopProducts = async (url: string) => {
  const products: ShopifyProduct[] = [];

  let limitReached = false;
  let page = 1;

  while (!limitReached) {
    const response = await axios.get(
      `${url}/products.json?page=${page}&limit=${LIMIT_BY_PAGE}`
    );
    const _products: ShopifyProduct[] = response.data.products;

    products.push(..._products);
    page++;
    if (_products.length < LIMIT_BY_PAGE) limitReached = true;
  }
  return products;
};
