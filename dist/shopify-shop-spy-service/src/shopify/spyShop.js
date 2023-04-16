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
function defaultProductFromShopifyProduct(product) {
  return {
    url: product.handle,
    name: product.title,
    image: product.images[0]?.src,
    price: parseFloat(product.variants[0].price),
    createdAt: (0, import_dayjs.default)(product.published_at).unix(),
    lastSaleAt: 0,
    sales: []
  };
}
const updateProductSalesData = async (shopifyProduct, product, currentTime) => {
  const variants = shopifyProduct.variants;
  const lastCount = product.sales[product.sales.length - 1].count;
  if (lastCount === -1) {
    product.sales[product.sales.length - 1].count = 0;
  } else {
    for (const variant of variants) {
      if (product.lastSaleAt < (0, import_dayjs.default)(variant.updated_at).unix()) {
        product.sales[product.sales.length - 1].count += 1;
      }
    }
  }
  product.lastSaleAt = currentTime;
  return product;
};
async function createMissingOrUpdateProducts(shop) {
  const shopProducts = [];
  const shopifyProducts = await (0, import_getShopProducts.getShopProducts)(shop.url);
  const currentTime = (0, import_dayjs.default)().unix();
  const currentHour = (0, import_dayjs.default)().startOf("hour").unix();
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
    const lastSale = defaultShopProduct.sales[defaultShopProduct.sales.length - 1];
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
async function spyShop(shop) {
  try {
    shop.products = shop.products || [];
    console.log("START", shop.url);
    await createMissingOrUpdateProducts(shop);
    console.log("END", shop.url);
    await (0, import_updateShop.updateShop)(shop);
  } catch (error) {
    console.error(`Catched error on shop ${shop.url}`, error.message);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  spyShop
});
//# sourceMappingURL=spyShop.js.map
