import {
  APPS_COLLECTION,
  SHOPS_COLLECTION,
  SHOP_PRODUCTS_COLLECTION,
  SHOP_PRODUCT_SALES,
  THEMES_COLLECTION,
  TIKTOK_ADS_COLLECTION,
  TIKTOK_ADS_CONFIG_COLLECTION,
} from './mongodb-collections';

import configuration from '@src/configuration';
import { client } from '@src/mongodb/conf';
import { AppModel } from '@src/types/app-model';
import { ShopModel } from '@src/types/shop-model';
import { ShopProductModel } from '@src/types/shop-product-model';
import { ShopProductSaleModel } from '@src/types/shop-product-sales-model';
import { ShopifyTheme } from '@src/types/shopifyTheme';
import { TiktokAdModel } from '@src/types/tiktok-ad-model';
import { TiktokAdsConfigModel } from '@src/types/tiktok-ads-config-model';

export function getTiktokAdsConfigCollection() {
  return client
    .db(configuration.mongodb.db)
    .collection<TiktokAdsConfigModel>(TIKTOK_ADS_CONFIG_COLLECTION);
}

export function getTiktokAdsCollection() {
  return client
    .db(configuration.mongodb.db)
    .collection<TiktokAdModel>(TIKTOK_ADS_COLLECTION);
}

export function getAppsCollection() {
  return client
    .db(configuration.mongodb.db)
    .collection<AppModel>(APPS_COLLECTION);
}

export function getThemesCollection() {
  return client
    .db(configuration.mongodb.db)
    .collection<ShopifyTheme>(THEMES_COLLECTION);
}

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
