import { getTiktokAdsCollection } from '@src/mongodb/collections';
import { arrayToChunks } from '@src/tools/arrayToChunks';
import { TiktokAdModel } from '@src/types/tiktok-ad-model';
import { getStorage } from 'firebase-admin/storage';
import { WithId } from 'mongodb';

export async function uploadVideos(ads: WithId<TiktokAdModel>[]) {
  const collection = getTiktokAdsCollection();
  const chunkSize = 10;
  const chunks = arrayToChunks(ads, chunkSize);

  const upload = async (ad: TiktokAdModel) => {
    const url = Object.values(ad.videoInfo.urls)[0];
    const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
    const storage = getStorage().bucket();
    const videoRef = storage.file(`tiktok-ads/${ad.adId}.mp4`);

    await videoRef.save(Buffer.from(arrayBuffer));
  };

  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];

    await Promise.all(
      chunk.map(async (ad) => {
        let success = false;

        for (let index = 0; index < 3 && !success; index++) {
          try {
            if (index > 0) console.info(`Retrying ${index}: ${ad.adId}...`);
            await upload(ad);
            if (ad._id) {
              await collection.updateOne(
                { _id: ad._id },
                { $set: { videoUploaded: true } }
              );
            }
            success = true;
          } catch (error) {
            if (index === 2) console.error(error);
          }
        }
      })
    );
    process.stdout.write(
      `Uploaded ${index * chunkSize + chunk.length}/${ads.length} videos\r`
    );
  }
  console.info(`\nUploaded ${ads.length} videos`);
}
