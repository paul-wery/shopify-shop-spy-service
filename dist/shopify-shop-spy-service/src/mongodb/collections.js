var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var collections_exports = {};
__export(collections_exports, {
  getAppsCollection: () => getAppsCollection,
  getShopProductSalesCollection: () => getShopProductSalesCollection,
  getShopProductsCollection: () => getShopProductsCollection,
  getShopsCollection: () => getShopsCollection,
  getThemesCollection: () => getThemesCollection,
  getTiktokAdsCollection: () => getTiktokAdsCollection,
  getTiktokAdsConfigCollection: () => getTiktokAdsConfigCollection
});
module.exports = __toCommonJS(collections_exports);
var import_mongodb_collections = require("./mongodb-collections");
var import_configuration = __toESM(require("@src/configuration"));
var import_conf = require("@src/mongodb/conf");
function getTiktokAdsConfigCollection() {
  return import_conf.client.db(import_configuration.default.mongodb.db).collection(import_mongodb_collections.TIKTOK_ADS_CONFIG_COLLECTION);
}
function getTiktokAdsCollection() {
  return import_conf.client.db(import_configuration.default.mongodb.db).collection(import_mongodb_collections.TIKTOK_ADS_COLLECTION);
}
function getAppsCollection() {
  return import_conf.client.db(import_configuration.default.mongodb.db).collection(import_mongodb_collections.APPS_COLLECTION);
}
function getThemesCollection() {
  return import_conf.client.db(import_configuration.default.mongodb.db).collection(import_mongodb_collections.THEMES_COLLECTION);
}
function getShopsCollection() {
  return import_conf.client.db(import_configuration.default.mongodb.db).collection(import_mongodb_collections.SHOPS_COLLECTION);
}
function getShopProductsCollection() {
  return import_conf.client.db(import_configuration.default.mongodb.db).collection(import_mongodb_collections.SHOP_PRODUCTS_COLLECTION);
}
function getShopProductSalesCollection() {
  return import_conf.client.db(import_configuration.default.mongodb.db).collection(import_mongodb_collections.SHOP_PRODUCT_SALES);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAppsCollection,
  getShopProductSalesCollection,
  getShopProductsCollection,
  getShopsCollection,
  getThemesCollection,
  getTiktokAdsCollection,
  getTiktokAdsConfigCollection
});
//# sourceMappingURL=collections.js.map
