var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var mongodb_collections_exports = {};
__export(mongodb_collections_exports, {
  APPS_COLLECTION: () => APPS_COLLECTION,
  INVITES_COLLECTION: () => INVITES_COLLECTION,
  ORGANIZATIONS_COLLECTION: () => ORGANIZATIONS_COLLECTION,
  SHOPS_COLLECTION: () => SHOPS_COLLECTION,
  SHOP_PRODUCTS_COLLECTION: () => SHOP_PRODUCTS_COLLECTION,
  SHOP_PRODUCT_SALES: () => SHOP_PRODUCT_SALES,
  SUBSCRIBED_SHOPS_COLLECTION: () => SUBSCRIBED_SHOPS_COLLECTION,
  THEMES_COLLECTION: () => THEMES_COLLECTION,
  TIKTOK_ADS_COLLECTION: () => TIKTOK_ADS_COLLECTION,
  TIKTOK_ADS_CONFIG_COLLECTION: () => TIKTOK_ADS_CONFIG_COLLECTION,
  USERS_COLLECTION: () => USERS_COLLECTION
});
module.exports = __toCommonJS(mongodb_collections_exports);
const USERS_COLLECTION = `users`;
const ORGANIZATIONS_COLLECTION = `organizations`;
const INVITES_COLLECTION = `invites`;
const SHOPS_COLLECTION = `shops`;
const SHOP_PRODUCTS_COLLECTION = `products`;
const SHOP_PRODUCT_SALES = `sales`;
const SUBSCRIBED_SHOPS_COLLECTION = `subscribed-shops`;
const THEMES_COLLECTION = `themes`;
const APPS_COLLECTION = `apps`;
const TIKTOK_ADS_COLLECTION = `tiktok-ads`;
const TIKTOK_ADS_CONFIG_COLLECTION = `tiktok-ads-config`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  APPS_COLLECTION,
  INVITES_COLLECTION,
  ORGANIZATIONS_COLLECTION,
  SHOPS_COLLECTION,
  SHOP_PRODUCTS_COLLECTION,
  SHOP_PRODUCT_SALES,
  SUBSCRIBED_SHOPS_COLLECTION,
  THEMES_COLLECTION,
  TIKTOK_ADS_COLLECTION,
  TIKTOK_ADS_CONFIG_COLLECTION,
  USERS_COLLECTION
});
//# sourceMappingURL=mongodb-collections.js.map
