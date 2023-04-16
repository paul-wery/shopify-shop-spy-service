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
  updateShop: () => updateShop
});
module.exports = __toCommonJS(updateShop_exports);
var import_collections = require("./collections");
async function updateShop(shop) {
  try {
    const shopsCollection = (0, import_collections.getShopsCollection)();
    await shopsCollection.updateOne({ _id: shop._id }, { $set: shop });
  } catch (error) {
    console.error(error.message);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateShop
});
//# sourceMappingURL=updateShop.js.map
