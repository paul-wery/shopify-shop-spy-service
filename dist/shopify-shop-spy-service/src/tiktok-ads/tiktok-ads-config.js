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
var tiktok_ads_config_exports = {};
__export(tiktok_ads_config_exports, {
  getTiktokAdsConfig: () => getTiktokAdsConfig,
  updateTiktokAdsConfig: () => updateTiktokAdsConfig
});
module.exports = __toCommonJS(tiktok_ads_config_exports);
var import_collections = require("@src/mongodb/collections");
function getTiktokAdsConfig() {
  const collection = (0, import_collections.getTiktokAdsConfigCollection)();
  return collection.findOne({});
}
async function updateTiktokAdsConfig(config) {
  const collection = (0, import_collections.getTiktokAdsConfigCollection)();
  const current = await getTiktokAdsConfig();
  await collection.updateOne(
    current?._id ? { _id: current._id } : {},
    { $set: config },
    { upsert: true }
  );
}
updateTiktokAdsConfig({
  countries: ["ES", "US", "FR", "IT", "PT"],
  languages: ["es", "en", "fr", "it", "pt"],
  industryCodes: ["30", "25", "20"]
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTiktokAdsConfig,
  updateTiktokAdsConfig
});
//# sourceMappingURL=tiktok-ads-config.js.map
