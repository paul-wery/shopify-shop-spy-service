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
var uploadTiktokAdVideo_exports = {};
__export(uploadTiktokAdVideo_exports, {
  uploadVideos: () => uploadVideos
});
module.exports = __toCommonJS(uploadTiktokAdVideo_exports);
var import_collections = require("@src/mongodb/collections");
var import_arrayToChunks = require("@src/tools/arrayToChunks");
var import_storage = require("firebase-admin/storage");
async function uploadVideos(ads) {
  const collection = (0, import_collections.getTiktokAdsCollection)();
  const chunkSize = 10;
  const chunks = (0, import_arrayToChunks.arrayToChunks)(ads, chunkSize);
  const upload = async (ad) => {
    const url = Object.values(ad.videoInfo.urls)[0];
    const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
    const storage = (0, import_storage.getStorage)().bucket();
    const videoRef = storage.file(`tiktok-ads/${ad.adId}.mp4`);
    await videoRef.save(Buffer.from(arrayBuffer));
  };
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    await Promise.all(
      chunk.map(async (ad) => {
        let success = false;
        for (let index2 = 0; index2 < 3 && !success; index2++) {
          try {
            if (index2 > 0)
              console.info(`Retrying ${index2}: ${ad.adId}...`);
            await upload(ad);
            if (ad._id) {
              await collection.updateOne(
                { _id: ad._id },
                { $set: { videoUploaded: true } }
              );
            }
            success = true;
          } catch (error) {
            if (index2 === 2)
              console.error(error);
          }
        }
      })
    );
    process.stdout.write(
      `Uploaded ${index * chunkSize + chunk.length}/${ads.length} videos\r`
    );
  }
  console.info(`
Uploaded ${ads.length} videos`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uploadVideos
});
//# sourceMappingURL=uploadTiktokAdVideo.js.map
