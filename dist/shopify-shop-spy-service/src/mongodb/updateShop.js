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
var updateShop_exports = {};
__export(updateShop_exports, {
  banShopFromBestProducts: () => banShopFromBestProducts,
  updateShop: () => updateShop,
  updateShopStatus: () => updateShopStatus
});
module.exports = __toCommonJS(updateShop_exports);
var import_collections = require("./collections");
async function updateShopStatus(shop, status) {
  const shopsCollection = (0, import_collections.getShopsCollection)();
  await shopsCollection.updateOne({ _id: shop._id }, { $set: { status } });
}
async function banShopFromBestProducts(shop) {
  const collection = (0, import_collections.getShopsCollection)();
  await collection.updateOne(
    { _id: shop._id },
    { $set: { bannedFromBestProducts: true } }
  );
}
async function updateShop(shop, products, sales) {
  try {
    const shopsCollection = (0, import_collections.getShopsCollection)();
    const productsCollection = (0, import_collections.getShopProductsCollection)();
    const salesCollection = (0, import_collections.getShopProductSalesCollection)();
    await shopsCollection.updateOne({ _id: shop._id }, { $set: shop });
    await productsCollection.bulkWrite(
      products.map((product) => {
        return {
          updateOne: {
            filter: {
              shopId: product.shopId,
              url: product.url
            },
            update: {
              $set: product
            },
            upsert: true
          }
        };
      })
    );
    await salesCollection.bulkWrite(
      sales.map((sale) => {
        return {
          updateOne: {
            filter: {
              shopId: sale.shopId,
              productUrl: sale.productUrl,
              date: sale.date
            },
            update: {
              $set: {
                shopId: sale.shopId,
                productUrl: sale.productUrl,
                date: sale.date
              },
              $inc: { count: sale.count }
            },
            upsert: true
          }
        };
      })
    );
  } catch (error) {
    console.error(error.message);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  banShopFromBestProducts,
  updateShop,
  updateShopStatus
});
//# sourceMappingURL=updateShop.js.map
