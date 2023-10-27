import express from 'express';
import { startSpyTiktokAds } from './crons/tiktok-ads';

import './firebase';
import { deleteCorruptedVideos } from './tiktok-ads/deleteCorruptedVideos';
import { uploadMissingVideos } from './tiktok-ads/uploadMissingVideos';
import { startCollectAdsDetails } from './tiktok-ads/startCollectAdsDetails';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();

app.listen(port, host, () => {
  console.info(`[ ready ] http://${host}:${port}`);
});

// startCollectApps();
// startCollectThemes();
// startSpyShops();
// startComputeSalesAndTurnover();
// startComputeProductsSalesAndTurnover();

startSpyTiktokAds();
// uploadMissingVideos();
// deleteCorruptedVideos();
// startCollectAdsDetails();
