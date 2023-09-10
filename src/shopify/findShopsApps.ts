/* eslint-disable no-control-regex */
import {
  getAppsCollection,
  getShopsCollection,
} from '@src/mongodb/collections';
import { ShopStatus } from '@src/types/shop-model';
import axios from 'axios';
import { ObjectId } from 'mongodb';

const appsFromCommentsRegex =
  /<!-- BEGIN app block: shopify:\/\/apps\/([^/]+)/g;
const appsFromAsyncLoadFunctionRegex =
  /function\s*asyncLoad\(\)\s*{\s*var\s*urls\s*=\s*\[([^\]]+)/;

function collectAppsFromAsyncLoadFunction(html: string) {
  try {
    return html.match(appsFromAsyncLoadFunctionRegex)[1].split(',');
  } catch {
    console.error('Error while collecting apps from async load function');
    return [];
  }
}

function collectAppsFromComments(html: string) {
  return [...html.matchAll(appsFromCommentsRegex)].map((e) => e[1]);
}

async function findShopApps(shopUrl: string) {
  const html = (await axios.get(shopUrl)).data.replace(/\r|\n/g, '');
  const apps = {
    fromComments: collectAppsFromComments(html),
    fromAsyncLoadFunction: collectAppsFromAsyncLoadFunction(html),
  };

  return apps;
}

export async function findShopsApps() {
  const shopsCollection = getShopsCollection();
  const appsCollection = getAppsCollection();

  const shops = await shopsCollection
    .find({ status: ShopStatus.ACTIVE, subscribersCount: { $gt: 0 } })
    .project({ url: 1 })
    .toArray();

  const apps = (await appsCollection.find({}).toArray()).map((app) => {
    return {
      ...app,
      flatName: app.name
        .toLowerCase()
        .replace(/\s|:/g, '-')
        .replace(/[^\x00-\x7F]+/g, '-')
        .replace(/-+/g, '-'),
    };
  });
  console.info('Get apps from database :', apps.length);

  //   const shops = ['https://lumaluxpro.com/'];

  console.info('Get shops from database :', shops.length);
  let successCount = 0;
  let errorCount = 0;
  for (const shop of shops) {
    try {
      const foundApps = await findShopApps(shop.url);
      const shopApps: ObjectId[] = [];

      console.info('Found apps :');
      console.info(foundApps.fromComments);
      for (const foundApp of foundApps.fromComments) {
        const app = apps.find((e) => e.flatName === foundApp);

        if (app) {
          console.info('Found app :', app.name);
          shopApps.push(app._id);
          successCount++;
        } else {
          console.info('Not found app :', foundApp);
          errorCount++;
        }
      }
      await shopsCollection.updateOne(
        { _id: shop._id },
        { $set: { installedApps: shopApps } }
      );
    } catch (error) {
      console.error('Error while finding shop apps :', error.message);
    }
  }
  console.info('Success count :', successCount);
  console.info('Error count :', errorCount);
}
