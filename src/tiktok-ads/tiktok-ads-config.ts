import { getTiktokAdsConfigCollection } from '@src/mongodb/collections';
import { TiktokAdsConfigModel } from '@src/types/tiktok-ads-config-model';
import { WithId } from 'mongodb';

export function getTiktokAdsConfig(): Promise<WithId<TiktokAdsConfigModel>> {
  const collection = getTiktokAdsConfigCollection();

  return collection.findOne({});
}

export async function updateTiktokAdsConfig(
  config: Partial<TiktokAdsConfigModel>
) {
  const collection = getTiktokAdsConfigCollection();
  const current = await getTiktokAdsConfig();

  await collection.updateOne(
    current?._id ? { _id: current._id } : {},
    { $set: config },
    { upsert: true }
  );
}

updateTiktokAdsConfig({
  countries: ['ES', 'US', 'FR', 'IT', 'PT'],
  languages: ['es', 'en', 'fr', 'it', 'pt'],
  industryCodes: ['30', '25', '20'],
});
