import { startCollectAds } from '@src/tiktok-ads/startCollectAds';
import { stopDynos } from '../heroku';
import { NO_ACCOUNTS_ERROR } from '@src/constants/index';
import { startCollectAdsDetails } from '@src/tiktok-ads/startCollectAdsDetails';
import { deleteCorruptedVideos } from '@src/tiktok-ads/deleteCorruptedVideos';

export const startSpyTiktokAds = async () => {
  let success = false;

  for (let index = 0; index < 3 && !success; index++) {
    try {
      success = await startCollectAds();
    } catch (error) {
      console.error(error);
      if (error.message === NO_ACCOUNTS_ERROR) break;
    }
  }
  try {
    await startCollectAdsDetails();
  } catch (error) {
    console.error(error);
  }
  try {
    await deleteCorruptedVideos();
  } catch (error) {
    console.error(error);
  }
  await stopDynos();
  console.info('Done');
};
