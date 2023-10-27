import { insertTiktokAds } from '@src/mongodb/insertTiktokAds';
import { TiktokAdModel } from '@src/types/tiktok-ad-model';
import { collectTiktokAds } from './collect';
import { getTiktokCredentials } from './get-tiktok-credentials';
import { getTiktokAdsConfig } from './tiktok-ads-config';
import { TiktokCredentials } from '@src/types/credentials';
import { industryCodesLabels } from '@src/types/tiktok-ads-config-model';

const QUOTA = 500;
const KEYWORDS = [
  'tiktokmademebuyit',
  'free shipping',
  'shop now',
  'buy it now',
  '50% off',
];

async function collectAds(
  credentials: TiktokCredentials,
  ad_language: string,
  industry: string
) {
  let hasMore = true;
  let page = 1;
  const ads: Omit<TiktokAdModel, 'id'>[] = [];

  while (hasMore) {
    const { data, pagination } = await collectTiktokAds({
      page,
      ad_language,
      industry,
      credentials,
    });

    ads.push(...data);
    hasMore = pagination.has_more;
    page++;
  }
  return ads;
}

export async function startCollectAds() {
  const { languages, industryCodes } = await getTiktokAdsConfig();

  let ads: Partial<TiktokAdModel>[] = [];
  const credentials = await getTiktokCredentials();

  if (!credentials) {
    console.error('Failed to get Tiktok Credentials');
    return false;
  }

  for (const language of languages) {
    for (const industry of industryCodes) {
      console.info(
        `Collecting ads for ${language} ${industryCodesLabels[industry]}...`
      );
      const collectedAds = await collectAds(credentials, language, industry);

      ads.push(...collectedAds);
      console.info(`Collected ${collectedAds.length} ads`);
    }
    ads = ads.filter(
      (ad, index) => ads.findIndex((e) => e.adId === ad.adId) === index
    );
    console.info(`Total collected ads for ${language}: ${ads.length}`);
    await insertTiktokAds(ads as TiktokAdModel[]);
    ads = [];
  }
  return true;
}
