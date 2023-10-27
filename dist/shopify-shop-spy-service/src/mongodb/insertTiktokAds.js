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
var insertTiktokAds_exports = {};
__export(insertTiktokAds_exports, {
  insertTiktokAds: () => insertTiktokAds
});
module.exports = __toCommonJS(insertTiktokAds_exports);
var import_uploadTiktokAdVideo = require("@src/firebase/uploadTiktokAdVideo");
var import_collections = require("./collections");
var import_convertToObjectId = require("./convertToObjectId");
async function insertTiktokAds(_ads) {
  const collection = (0, import_collections.getTiktokAdsCollection)();
  const ads = _ads.map((ad) => ({
    ...ad,
    _id: (0, import_convertToObjectId.convertToObjectId)(ad.adId)
  }));
  try {
    const result = await collection.insertMany(ads, { ordered: false });
    console.info(`Inserted ${result.insertedCount} ads`);
    await (0, import_uploadTiktokAdVideo.uploadVideos)(ads);
  } catch (error) {
    const toUpdate = error.writeErrors.map((error2) => error2.err.op);
    await Promise.all(
      toUpdate.map((ad) => {
        const { _id, ...data } = ad;
        return collection.updateOne({ _id }, { $set: data });
      })
    );
    console.info(`Inserted ${error.result.insertedCount} ads`);
    console.info(`Updated ${toUpdate.length} ads`);
    const videosToUpload = ads.filter(
      (ad) => !toUpdate.find((u) => u.adId === ad.adId)
    );
    await (0, import_uploadTiktokAdVideo.uploadVideos)(videosToUpload);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  insertTiktokAds
});
//# sourceMappingURL=insertTiktokAds.js.map
