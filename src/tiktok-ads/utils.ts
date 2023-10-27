import { TIKTOK_ACCOUNTS_POOL } from '@src/constants/index';

export function getRandomAccount(array: typeof TIKTOK_ACCOUNTS_POOL) {
  return array[Math.floor(Math.random() * array.length)];
}
