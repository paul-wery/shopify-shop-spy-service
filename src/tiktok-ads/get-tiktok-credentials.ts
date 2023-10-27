import {
  NO_ACCOUNTS_ERROR,
  TIKTOK_ACCOUNTS_POOL,
  TIKTOK_ROOT,
} from '@src/constants/index';
import { TiktokCredentials } from '@src/types/credentials';
import fs from 'fs';
import { BrowserContext, Page } from 'playwright-chromium';
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PLAYWRIGHT_CONFIG } from './config';
import { getRandomAccount } from './utils';

chromium.use(stealthPlugin());

async function extractCredentials(page: Page): Promise<TiktokCredentials> {
  await page.goto(TIKTOK_ROOT);
  return new Promise((resolve) => {
    page.on('request', (request) => {
      if (request.url().includes('list?')) {
        const headers = request.headers();
        const webId = headers['web-id'];
        const userSign = headers['user-sign'];
        const timestamp = headers['timestamp'];

        resolve({ webId, userSign, timestamp });
      }
    });
  });
}

async function loginWithGoogle(context: BrowserContext, page: Page) {
  const credentials = getRandomAccount(
    TIKTOK_ACCOUNTS_POOL.filter((e) => !e.blocked)
  );

  if (!credentials) return false;

  const { email, password } = credentials;

  await page.goto(TIKTOK_ROOT);
  await page.waitForLoadState('domcontentloaded');
  await page.click('text="Log in"');

  await page.click('text="Log in with Google"');

  let maxWait = 3;
  while (context.pages().length < 2 && maxWait > 0) {
    await page.waitForTimeout(1000);
    maxWait--;
  }

  if (context.pages().length < 2) {
    return loginWithGoogle(context, page);
  }

  const popup = context.pages()[1];

  await popup.waitForLoadState('networkidle');
  await popup.fill('input[type="email"]', email);
  await popup.keyboard.press('Enter');

  try {
    await popup.fill('input[type="password"]', password, { timeout: 5000 });
    await popup.keyboard.press('Enter');
  } catch (error) {
    if (
      (await popup.isVisible('text="Try again"')) ||
      (await popup.isVisible('text="Reintentar"'))
    ) {
      credentials.blocked = true;
      await popup.close();
      return loginWithGoogle(context, page);
    } else throw error;
  }

  await popup.waitForLoadState('networkidle');
  if (
    (await popup.isVisible('input[type="tel"]')) ||
    (await popup.isVisible('text="Recover account"')) ||
    (await popup.isVisible('text="Recuperar la cuenta"'))
  ) {
    credentials.blocked = true;
    await popup.close();
    return loginWithGoogle(context, page);
  }
  return true;
}

export async function getTiktokCredentials() {
  console.info('Get Tiktok Credentials');
  const browser = await chromium.launch(PLAYWRIGHT_CONFIG);
  let credentials: TiktokCredentials | null = null;
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();

  try {
    console.log('Login with Google');
    const success = await loginWithGoogle(context, page);

    if (!success) throw new Error(NO_ACCOUNTS_ERROR);
    console.log('Login with Google: Done');

    console.log('extractCredentials');
    credentials = await extractCredentials(page);
    console.info('Get Tiktok Credentials: Done');
  } catch (error) {
    console.error('Get Tiktok Credentials: Failed');
    if (error.message === NO_ACCOUNTS_ERROR) throw error;
    console.error(error);
    fs.writeFileSync('./error.html', await context.pages()[1].content());
  } finally {
    await browser.close();
  }
  return credentials;
}
