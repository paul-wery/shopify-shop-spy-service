import express from 'express';
import {
  startCollectApps,
  startCollectThemes,
  startSpyShops,
} from './crons/shopify';
import {
  startComputeProductsSalesAndTurnover,
  startComputeSalesAndTurnover,
} from './crons/database';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();

app.listen(port, host, () => {
  console.info(`[ ready ] http://${host}:${port}`);
});

// startCollectApps();
startCollectThemes();
startSpyShops();
startComputeSalesAndTurnover();
startComputeProductsSalesAndTurnover();

// async function testMaxRequest() {
//   const loop = async () => {
//     const start = dayjs();
//     let requestNumber = 0;
//     let count = 0;

//     console.info('Start : ', start.format('HH:mm:ss'));
//     while (count < 50) {
//       try {
//         await Promise.all([
//           poolRequest.get(
//             'https://magicspoon.com/products.json?page=1&limit=250'
//           ),
//           poolRequest.get(
//             'https://jonesroadbeauty.com/products.json?page=1&limit=250'
//           ),
//           poolRequest.get(
//             'https://theoodie.com/products.json?page=1&limit=250'
//           ),
//         ]);

//         requestNumber++;
//       } catch (error) {
//         console.info(
//           `${error.message} : ${dayjs().diff(start, 'second') + 's'}`
//         );
//         count = 100000;
//         console.info('Request number : ', requestNumber);
//       }
//       count++;
//     }
//     // Waiting until the end of the minute
//     const waitingTime = 60 - dayjs().diff(start, 'second') + 1;

//     console.info('Waiting for : ', waitingTime);
//     await new Promise((resolve) => setTimeout(resolve, waitingTime * 1000));
//   };

//   // eslint-disable-next-line no-constant-condition
//   while (true) {
//     await loop();
//   }
// }

// testMaxRequest();
