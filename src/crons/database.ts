import { computeProductsSalesAndTurnover } from '@src/mongodb/computeProductsSalesAndTurnover';
import { computeSalesAndTurnover } from '@src/mongodb/computeSalesAndTurnover';
import { client } from '@src/mongodb/conf';
import { getShops } from '@src/mongodb/getShops';
import { scheduleJob } from 'node-schedule';

export const startComputeSalesAndTurnover = async () => {
  const job = scheduleJob('0 * * * *', async () => {
    await client.connect();
    console.info('RUNNING ComputeSalesAndTurnover');
    const shops = await getShops();

    for (let index = 0; index < shops.length; index++) {
      const shop = shops[index];

      await computeSalesAndTurnover(shop);
      process.stdout.write(`Processed: ${index + 1}/${shops.length}\r`);
    }
    console.info('DONE ComputeSalesAndTurnover');
  });

  return job;
};

export const startComputeProductsSalesAndTurnover = async () => {
  const job = scheduleJob('0 0 * * *', async () => {
    await client.connect();
    console.info('RUNNING ComputeProductsSalesAndTurnover');
    const shops = await getShops();

    for (let index = 0; index < shops.length; index++) {
      const shop = shops[index];

      await computeProductsSalesAndTurnover(shop);
      process.stdout.write(`Processed: ${index + 1}/${shops.length}\r`);
    }
    console.info('DONE ComputeProductsSalesAndTurnover');
  });

  return job;
};
