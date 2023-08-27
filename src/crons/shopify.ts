import { getShops } from '@src/mongodb/getShops';
import { Range, RecurrenceRule, scheduleJob } from 'node-schedule';

import { client } from '@src/mongodb/conf';
import { spyShop } from '@src/shopify/spyShop';
import { collectThemes } from '@src/shopify/collectThemes';

export const startCollectThemes = async () => {
  const rule = new RecurrenceRule();

  rule.hour = 0;
  rule.minute = 0;

  const job = scheduleJob(rule, async () => {
    await client.connect();
    console.info('RUNNING startCollectThemes');
    await collectThemes();
    console.info('Done CollectThemes!');
  });

  return job;
};

export const startSpyShops = async () => {
  const rule = new RecurrenceRule();

  rule.second = new Range(0, 59, 60);

  const job = scheduleJob(rule, async () => {
    await client.connect();
    console.info('RUNNING startSpyShops');
    const shops = await getShops();
    const promises = [];

    for (let index = 0; index < shops.length; index++) {
      const shop = shops[index];

      promises.push(spyShop(shop));
    }
    await Promise.all(promises);
    console.info('Done SpyShops!');
  });

  return job;
};
