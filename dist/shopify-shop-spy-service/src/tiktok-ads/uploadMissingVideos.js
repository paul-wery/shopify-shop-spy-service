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
var uploadMissingVideos_exports = {};
__export(uploadMissingVideos_exports, {
  uploadMissingVideos: () => uploadMissingVideos
});
module.exports = __toCommonJS(uploadMissingVideos_exports);
var import_uploadTiktokAdVideo = require("@src/firebase/uploadTiktokAdVideo");
var import_collections = require("@src/mongodb/collections");
var import_arrayToChunks = require("@src/tools/arrayToChunks");
var import_storage = require("firebase-admin/storage");
async function uploadMissingVideos() {
  const collection = (0, import_collections.getTiktokAdsCollection)();
  const ads = await collection.find({ videoUploaded: { $ne: true } }).toArray();
  console.info(`${ads.length} unchecked videos`);
  const chunkSize = 10;
  const chunks = (0, import_arrayToChunks.arrayToChunks)(ads, chunkSize);
  const storage = (0, import_storage.getStorage)().bucket();
  const toUpload = [];
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    const result = await Promise.all(
      chunk.map(async (ad) => {
        const exists = await storage.file(`tiktok-ads/${ad.adId}.mp4`).exists();
        if (exists[0]) {
          await collection.updateOne(
            { _id: ad._id },
            { $set: { videoUploaded: true } }
          );
          return null;
        }
        return ad;
      })
    );
    toUpload.push(...result.filter(Boolean));
    process.stdout.write(
      `Missing videos: ${toUpload.length} / Chunk ${index + 1}/${chunks.length}\r`
    );
  }
  await (0, import_uploadTiktokAdVideo.uploadVideos)(toUpload);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uploadMissingVideos
});
//# sourceMappingURL=uploadMissingVideos.js.map
