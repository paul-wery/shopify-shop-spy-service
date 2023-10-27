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
var tiktok_ads_exports = {};
__export(tiktok_ads_exports, {
  startSpyTiktokAds: () => startSpyTiktokAds
});
module.exports = __toCommonJS(tiktok_ads_exports);
var import_startCollectAds = require("@src/tiktok-ads/startCollectAds");
var import_heroku = require("../heroku");
var import_constants = require("@src/constants/index");
var import_startCollectAdsDetails = require("@src/tiktok-ads/startCollectAdsDetails");
var import_deleteCorruptedVideos = require("@src/tiktok-ads/deleteCorruptedVideos");
const startSpyTiktokAds = async () => {
  let success = false;
  for (let index = 0; index < 3 && !success; index++) {
    try {
      success = await (0, import_startCollectAds.startCollectAds)();
    } catch (error) {
      console.error(error);
      if (error.message === import_constants.NO_ACCOUNTS_ERROR)
        break;
    }
  }
  try {
    await (0, import_startCollectAdsDetails.startCollectAdsDetails)();
  } catch (error) {
    console.error(error);
  }
  try {
    await (0, import_deleteCorruptedVideos.deleteCorruptedVideos)();
  } catch (error) {
    console.error(error);
  }
  await (0, import_heroku.stopDynos)();
  console.info("Done");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startSpyTiktokAds
});
//# sourceMappingURL=tiktok-ads.js.map
