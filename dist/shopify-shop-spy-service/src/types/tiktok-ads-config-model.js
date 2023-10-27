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
var tiktok_ads_config_model_exports = {};
__export(tiktok_ads_config_model_exports, {
  industryCodesLabels: () => industryCodesLabels
});
module.exports = __toCommonJS(tiktok_ads_config_model_exports);
const industryCodesLabels = {
  "30": "E-commerce",
  "25": "Games",
  "20": "Apps"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  industryCodesLabels
});
//# sourceMappingURL=tiktok-ads-config-model.js.map
