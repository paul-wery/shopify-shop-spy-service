import {
  SHOPS_COLLECTION,
  SHOP_PRODUCTS_COLLECTION,
} from './mongodb-collections';

import configuration from '@src/configuration';
import { client } from '@src/mongodb/conf';
import { ShopModel } from '@src/types/shop-model';
import { ShopProductModel } from '@src/types/shop-product-model';

export function getShopsCollection() {
  return client
    .db(configuration.mongodb.db)
    .collection<ShopModel>(SHOPS_COLLECTION);
}

export function getShopProductsCollection(shopId: string) {
  return client
    .db(configuration.mongodb.db)
    .collection<ShopProductModel>(
      `${SHOPS_COLLECTION}/${shopId}/${SHOP_PRODUCTS_COLLECTION}`
    );
}
