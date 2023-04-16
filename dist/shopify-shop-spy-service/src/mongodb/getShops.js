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
var getShops_exports = {};
__export(getShops_exports, {
  getShops: () => getShops
});
module.exports = __toCommonJS(getShops_exports);
var import_collections = require("./collections");
async function getShops() {
  try {
    const shopsCollection = (0, import_collections.getShopsCollection)();
    return shopsCollection.find({ subscribersCount: { $gt: 0 } }).toArray();
  } catch (error) {
    console.error(error.message);
  }
  return [];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getShops
});
//# sourceMappingURL=getShops.js.map
