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
var spyShop_exports = {};
__export(spyShop_exports, {
  spyShop: () => spyShop
});
module.exports = __toCommonJS(spyShop_exports);
var import_updateShop = require("@src/mongodb/updateShop");
var import_dayjs = __toESM(require("dayjs"));
var import_getShopProducts = require("./getShopProducts");
var import_collections = require("@src/mongodb/collections");
function shopifyProductToProductModel(shopId, product) {
  return {
    shopId,
    url: product.handle,
    name: product.title,
    image: product.images[0]?.src,
    price: parseFloat(product.variants[0].price),
    createdAt: (0, import_dayjs.default)(product.published_at).unix()
  };
}
const updateProductSalesData = (shop, shopifyProduct, currentHour) => {
  const variants = shopifyProduct.variants;
  let count = 0;
  if (shop.lastUpdate) {
    for (const variant of variants) {
      if (shop.lastUpdate < (0, import_dayjs.default)(variant.updated_at).unix()) {
        count += 1;
      }
    }
  }
  return {
    shopId: shop._id,
    productUrl: shopifyProduct.handle,
    count,
    date: currentHour
  };
};
async function createMissingOrUpdateProducts(shop) {
  const shopifyProducts = await (0, import_getShopProducts.getShopProducts)(shop);
  const currentTime = (0, import_dayjs.default)().unix();
  const currentHour = (0, import_dayjs.default)().startOf("hour").unix();
  const products = [];
  const sales = [];
  for (let index = 0; index < shopifyProducts.length; index++) {
    const shopifyProduct = shopifyProducts[index];
    const newSale = updateProductSalesData(shop, shopifyProduct, currentHour);
    if (newSale.count > 0) {
      sales.push(newSale);
      products.push(shopifyProductToProductModel(shop._id, shopifyProduct));
    }
  }
  if (!shop.lastUpdate) {
    const shopsCollection = (0, import_collections.getShopsCollection)();
    await shopsCollection.updateOne(
      { _id: shop._id },
      { $set: { lastUpdate: currentTime } }
    );
  } else if (sales.length > 0) {
    shop.lastUpdate = currentTime;
    await (0, import_updateShop.updateShop)(shop, products, sales);
  }
}
async function spyShop(shop) {
  try {
    console.log("START", shop.url);
    await createMissingOrUpdateProducts(shop);
    console.log("END", shop.url);
  } catch (error) {
    console.error(`Catched error on shop ${shop.url}`, error.message);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  spyShop
});
//# sourceMappingURL=spyShop.js.map
