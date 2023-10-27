import { getTiktokAdsCollection } from '@src/mongodb/collections';
import { arrayToChunks } from '@src/tools/arrayToChunks';
import { getStorage } from 'firebase-admin/storage';

export async function deleteCorruptedVideos() {
  const collection = getTiktokAdsCollection();
  const ads = await collection.find({}).toArray();

  console.info(`${ads.length} videos to check`);

  const chunkSize = 10;
  const chunks = arrayToChunks(ads, chunkSize);
  const storage = getStorage().bucket();
  let count = 0;

  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];

    await Promise.all(
      chunk.map(async (ad) => {
        try {
          const ref = storage.file(`tiktok-ads/${ad.adId}.mp4`);
          const video = (await ref.getMetadata())[0];

          if (parseInt(video.size) < 1000) {
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
