import { getShops } from '@src/mongodb/getShops';
import { Range, RecurrenceRule, scheduleJob } from 'node-schedule';
import { spyShop } from './spyShop';
import { client } from '@src/mongodb/conf';
import { collectThemes } from './collectThemes';

export const startCollectThemes = async () => {
  const rule = new RecurrenceRule();

  rule.hour = 0;
  rule.minute = 0;

  const job = scheduleJob(rule, async () => {
    await client.connect();
    console.log('RUNNING startCollectThemes');
    await collectThemes();
  });

  return job;
};

export const startSpyShops = async () => {
  const rule = new RecurrenceRule();

  rule.second = new Range(0, 59, 60);

  const job = scheduleJob(rule, async () => {
    await client.connect();
    console.log('RUNNING startSpyShops');
    const shops = await getShops();

    for (let index = 0; index < shops.length; index++) {
      const shop = shops[index];

      spyShop(shop);
    }
  });

  return job;
};
