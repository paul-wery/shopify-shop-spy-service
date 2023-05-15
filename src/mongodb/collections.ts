import {
  SHOPS_COLLECTION,
  SHOP_PRODUCTS_COLLECTION,
  SHOP_PRODUCT_SALES,
} from './mongodb-collections';

import configuration from '@src/configuration';
import { client } from '@src/mongodb/conf';
import { ShopModel } from '@src/types/shop-model';
import { ShopProductModel } from '@src/types/shop-product-model';
import { ShopProductSaleModel } from '@src/types/shop-product-sales-model';

export function getShopsCollection() {
  return client
    .db(configuration.mongodb.db)
    .collection<ShopModel>(SHOPS_COLLECTION);
}

export function getShopProductsCollection() {
  return client
    .db(configuration.mongodb.db)
    .collection<ShopProductModel>(SHOP_PRODUCTS_COLLECTION);
}

export function getShopProductSalesCollection() {
  return client
    .db(configuration.mongodb.db)
    .collection<ShopProductSaleModel>(SHOP_PRODUCT_SALES);
}
