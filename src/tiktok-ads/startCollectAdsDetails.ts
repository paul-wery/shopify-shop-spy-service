import { getTiktokAdsCollection } from '@src/mongodb/collections';
import { getTiktokCredentials } from './get-tiktok-credentials';
import { collectAdDetails } from './collect-ad-details';

export async function startCollectAdsDetails() {
  const collection = getTiktokAdsCollection();
  const ads = await collection
    .find({
      landingPageUrl: { $exists: false },
      detailsNotFound: { $ne: true },
    })
    .toArray();
  const credentials = await getTiktokCredentials();
  let count = 0;
  let errorCount = 0;

  if (!credentials) {
    console.error('Failed to get Tiktok Credentials');
    return false;
  }

  for (const ad of ads) {
    try {
      const detailsData = await collectAdDetails(ad.adId, credentials);

      await collection.updateOne({ _id: ad._id }, { $set: detailsData });
    } catch {
      errorCount++;
    } finally {
      await collection.updateOne(
        { _id: ad._id },
        { $set: { detailsNotFound: true } }
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    process.stdout.write(
      `Processed: ${++count}/${ads.length} - Error: ${errorCount}\r`
    );
  }
  return true;
}
