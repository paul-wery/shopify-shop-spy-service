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
var shop_model_exports = {};
__export(shop_model_exports, {
  ShopStatus: () => ShopStatus
});
module.exports = __toCommonJS(shop_model_exports);
var ShopStatus = /* @__PURE__ */ ((ShopStatus2) => {
  ShopStatus2["ACTIVE"] = "ACTIVE";
  ShopStatus2["OUT_OF_LIMIT"] = "OUT_OF_LIMIT";
  return ShopStatus2;
})(ShopStatus || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ShopStatus
});
//# sourceMappingURL=shop-model.js.map
