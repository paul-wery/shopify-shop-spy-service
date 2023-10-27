var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var tiktok_ad_model_exports = {};
module.exports = __toCommonJS(tiktok_ad_model_exports);
var Budget = /* @__PURE__ */ ((Budget2) => {
  Budget2[Budget2["LOW"] = 0] = "LOW";
  Budget2[Budget2["MEDIUM"] = 1] = "MEDIUM";
  Budget2[Budget2["HIGH"] = 2] = "HIGH";
  return Budget2;
})(Budget || {});
//# sourceMappingURL=tiktok-ad-model.js.map
