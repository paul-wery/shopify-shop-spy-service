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
var getShopProducts_exports = {};
__export(getShopProducts_exports, {
  getShopProducts: () => getShopProducts
});
module.exports = __toCommonJS(getShopProducts_exports);
var import_configuration = __toESM(require("@src/configuration"));
var import_updateShop = require("@src/mongodb/updateShop");
var import_proxy = require("@src/proxy/index");
var import_shop_model = require("@src/types/shop-model");
const LIMIT_BY_PAGE = 250;
const MAX_SHOP_PRODUCTS = import_configuration.default.limits.maxShopProducts;
const PAGE_LIMIT = MAX_SHOP_PRODUCTS / LIMIT_BY_PAGE;
const average = {};
async function handleExceedLimit(shop, products) {
  if (products.length >= MAX_SHOP_PRODUCTS) {
    await (0, import_updateShop.updateShopStatus)(shop, import_shop_model.ShopStatus.OUT_OF_LIMIT);
    return [];
  }
  return products;
}
const getShopProducts = async (shop) => {
  const url = shop.url;
  const products = [];
  let limitReached = false;
  let page = 1;
  while (!limitReached && page <= PAGE_LIMIT) {
    const response = await import_proxy.poolRequest.get(
      `${url}/products.json?page=${page}&limit=${LIMIT_BY_PAGE}`
    );
    const _products = response.data.products;
    products.push(..._products);
    page++;
    if (_products.length < LIMIT_BY_PAGE)
      limitReached = true;
  }
  average[url] = (page - 1) * LIMIT_BY_PAGE;
  return handleExceedLimit(shop, products);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getShopProducts
});
//# sourceMappingURL=getShopProducts.js.map
