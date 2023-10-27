import { GOOGLE_ACCOUNT } from '@src/types/google-account';

export const TIKTOK_ROOT =
  'https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en';

export const ACCOUNTS = JSON.parse(process.env.GOOGLE_ACCOUNTS as string)
  .array as GOOGLE_ACCOUNT[];

export const TIKTOK_ACCOUNTS_POOL = ACCOUNTS.map((e) => ({
  ...e,
  blocked: false,
}));

export const NO_ACCOUNTS_ERROR =
  'Login with Google: Failed - No valid accounts';
