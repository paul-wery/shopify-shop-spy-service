import { getShops } from '@src/mongodb/getShops';
import { Range, RecurrenceRule, scheduleJob } from 'node-schedule';
import { spyShop } from './spyShop';
import { client } from '@src/mongodb/conf';

export const startSpyShops = async () => {
  const rule = new RecurrenceRule();

  rule.second = new Range(0, 59, 60);

  const job = scheduleJob(rule, async () => {
    await client.connect();
    console.log('RUNNING');
    const shops = await getShops();

    for (let index = 0; index < shops.length; index++) {
      const shop = shops[index];

      spyShop(shop);
    }
  });

  return job;
};
