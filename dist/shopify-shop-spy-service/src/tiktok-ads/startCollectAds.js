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
var startCollectAds_exports = {};
__export(startCollectAds_exports, {
  startCollectAds: () => startCollectAds
});
module.exports = __toCommonJS(startCollectAds_exports);
var import_insertTiktokAds = require("@src/mongodb/insertTiktokAds");
var import_collect = require("./collect");
var import_get_tiktok_credentials = require("./get-tiktok-credentials");
var import_tiktok_ads_config = require("./tiktok-ads-config");
var import_tiktok_ads_config_model = require("@src/types/tiktok-ads-config-model");
const QUOTA = 500;
const KEYWORDS = [
  "tiktokmademebuyit",
  "free shipping",
  "shop now",
  "buy it now",
  "50% off"
];
const KEYWORD = "tiktokmademebuyit";
async function collectAds(credentials, ad_language, industry) {
  let hasMore = true;
  let page = 1;
  const ads = [];
  while (hasMore) {
    const { data, pagination } = await (0, import_collect.collectTiktokAds)({
      page,
      ad_language,
      industry,
      credentials,
      keyword: KEYWORD
    });
    ads.push(...data);
    hasMore = pagination.has_more;
    page++;
  }
  return ads;
}
async function startCollectAds() {
  const { languages, industryCodes } = await (0, import_tiktok_ads_config.getTiktokAdsConfig)();
  let ads = [];
  const credentials = await (0, import_get_tiktok_credentials.getTiktokCredentials)();
  if (!credentials) {
    console.error("Failed to get Tiktok Credentials");
    return false;
  }
  for (const language of languages) {
    for (const industry of industryCodes) {
      console.info(
        `Collecting ads for ${language} ${import_tiktok_ads_config_model.industryCodesLabels[industry]}...`
      );
      const collectedAds = await collectAds(credentials, language, industry);
      ads.push(...collectedAds);
      console.info(`Collected ${collectedAds.length} ads`);
    }
    ads = ads.filter(
      (ad, index) => ads.findIndex((e) => e.adId === ad.adId) === index
    );
    console.info(`Total collected ads for ${language}: ${ads.length}`);
    await (0, import_insertTiktokAds.insertTiktokAds)(ads);
    ads = [];
  }
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startCollectAds
});
//# sourceMappingURL=startCollectAds.js.map
