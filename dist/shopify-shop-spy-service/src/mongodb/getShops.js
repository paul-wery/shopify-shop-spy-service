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
var getShops_exports = {};
__export(getShops_exports, {
  getShops: () => getShops
});
module.exports = __toCommonJS(getShops_exports);
var import_shop_model = require("@src/types/shop-model");
var import_dayjs = __toESM(require("dayjs"));
var import_collections = require("./collections");
async function getShops() {
  try {
    const start = (0, import_dayjs.default)();
    const shopsCollection = (0, import_collections.getShopsCollection)();
    const query = shopsCollection.aggregate([
      {
        $match: {
          subscribersCount: { $gt: 0 },
          status: { $ne: import_shop_model.ShopStatus.OUT_OF_LIMIT }
        }
      }
    ]);
    const data = await query.toArray();
    console.info(
      `getShops (${data.length}) in : ${(0, import_dayjs.default)().diff(start, "second")}s`
    );
    return data;
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
