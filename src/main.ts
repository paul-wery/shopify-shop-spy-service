import express from 'express';
import { startSpyShops } from './shopify';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

startSpyShops();
