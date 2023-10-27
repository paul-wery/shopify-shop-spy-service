import { uploadVideos } from '@src/firebase/uploadTiktokAdVideo';
import { TiktokAdModel } from '@src/types/tiktok-ad-model';
import { ObjectId, WithId } from 'mongodb';
import { getTiktokAdsCollection } from './collections';
import { convertToObjectId } from './convertToObjectId';

export async function insertTiktokAds(_ads: TiktokAdModel[]) {
  const collection = getTiktokAdsCollection();
  const ads: WithId<TiktokAdModel>[] = _ads.map((ad) => ({
    ...ad,
    _id: convertToObjectId(ad.adId),
  }));

  try {
    const result = await collection.insertMany(ads, { ordered: false });

    console.info(`Inserted ${result.insertedCount} ads`);

    await uploadVideos(ads);
  } catch (error) {
    const toUpdate: (TiktokAdModel & { _id: ObjectId })[] =
      error.writeErrors.map((error) => error.err.op);

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

    await uploadVideos(videosToUpload);
  }
}
