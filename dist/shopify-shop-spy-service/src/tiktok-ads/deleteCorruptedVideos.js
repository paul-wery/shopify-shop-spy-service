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
var deleteCorruptedVideos_exports = {};
__export(deleteCorruptedVideos_exports, {
  deleteCorruptedVideos: () => deleteCorruptedVideos
});
module.exports = __toCommonJS(deleteCorruptedVideos_exports);
var import_collections = require("@src/mongodb/collections");
var import_arrayToChunks = require("@src/tools/arrayToChunks");
var import_storage = require("firebase-admin/storage");
async function deleteCorruptedVideos() {
  const collection = (0, import_collections.getTiktokAdsCollection)();
  const ads = await collection.find({}).toArray();
  console.info(`${ads.length} videos to check`);
  const chunkSize = 10;
  const chunks = (0, import_arrayToChunks.arrayToChunks)(ads, chunkSize);
  const storage = (0, import_storage.getStorage)().bucket();
  let count = 0;
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    await Promise.all(
      chunk.map(async (ad) => {
        try {
          const ref = storage.file(`tiktok-ads/${ad.adId}.mp4`);
          const video = (await ref.getMetadata())[0];
          if (parseInt(video.size) < 1e3) {
            count++;
            await ref.delete();
            await collection.deleteOne({ _id: ad._id });
            process.stdout.write(`${count} videos deleted \r`);
          }
        } catch (error) {
          console.error(`Error checking ${ad.adId} video (deleting ad)`);
          count++;
          await collection.deleteOne({ _id: ad._id });
        }
      })
    );
    process.stdout.write(
      `Chunk ${index + 1}/${chunks.length} - ${count} videos deleted \r`
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteCorruptedVideos
});
//# sourceMappingURL=deleteCorruptedVideos.js.map
