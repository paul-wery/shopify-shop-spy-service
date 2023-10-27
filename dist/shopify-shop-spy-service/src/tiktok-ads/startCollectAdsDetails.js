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
var startCollectAdsDetails_exports = {};
__export(startCollectAdsDetails_exports, {
  startCollectAdsDetails: () => startCollectAdsDetails
});
module.exports = __toCommonJS(startCollectAdsDetails_exports);
var import_collections = require("@src/mongodb/collections");
var import_get_tiktok_credentials = require("./get-tiktok-credentials");
var import_collect_ad_details = require("./collect-ad-details");
async function startCollectAdsDetails() {
  const collection = (0, import_collections.getTiktokAdsCollection)();
  const ads = await collection.find({
    landingPageUrl: { $exists: false },
    detailsNotFound: { $ne: true }
  }).toArray();
  const credentials = await (0, import_get_tiktok_credentials.getTiktokCredentials)();
  let count = 0;
  let errorCount = 0;
  if (!credentials) {
    console.error("Failed to get Tiktok Credentials");
    return false;
  }
  for (const ad of ads) {
    try {
      const detailsData = await (0, import_collect_ad_details.collectAdDetails)(ad.adId, credentials);
      await collection.updateOne({ _id: ad._id }, { $set: detailsData });
    } catch {
      errorCount++;
    } finally {
      await collection.updateOne(
        { _id: ad._id },
        { $set: { detailsNotFound: true } }
      );
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
    process.stdout.write(
      `Processed: ${++count}/${ads.length} - Error: ${errorCount}\r`
    );
  }
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startCollectAdsDetails
});
//# sourceMappingURL=startCollectAdsDetails.js.map
