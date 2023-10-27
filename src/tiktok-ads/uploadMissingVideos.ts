import { uploadVideos } from '@src/firebase/uploadTiktokAdVideo';
import { getTiktokAdsCollection } from '@src/mongodb/collections';
import { arrayToChunks } from '@src/tools/arrayToChunks';
import { TiktokAdModel } from '@src/types/tiktok-ad-model';
import { getStorage } from 'firebase-admin/storage';
import { WithId } from 'mongodb';

export async function uploadMissingVideos() {
  const collection = getTiktokAdsCollection();
  const ads = await collection.find({ videoUploaded: { $ne: true } }).toArray();

  console.info(`${ads.length} unchecked videos`);

  const chunkSize = 10;
  const chunks = arrayToChunks(ads, chunkSize);
  const storage = getStorage().bucket();
  const toUpload: WithId<TiktokAdModel>[] = [];

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
      `Missing videos: ${toUpload.length} / Chunk ${index + 1}/${
        chunks.length
      }\r`
    );
  }
  await uploadVideos(toUpload);
}
