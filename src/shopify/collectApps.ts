import { updateApps } from '@src/mongodb/updateApp';
import { AppModel } from '@src/types/app-model';
import playwright, { Page } from 'playwright';

const shopifyAppsRootUrl = 'https://apps.shopify.com';
const shopifyAppsUrl = `${shopifyAppsRootUrl}/search?sort_by=popular`;
const categoriesRegex = /<input.+?(?<=id="categories_").*\svalue="([^"]+)/gm;
const appsBlockRegex =
  /<a[^>]+?(?<=data-app-link-details).+?(?<=total reviews)/gm;
const appsRegex =
  /href="([^"]+)"[^>]+?(?<=data-app-link-details)[^>]*>([^<]+).+?(?<=<span>)\s*(\d.\d).+?(?=\(\d)\(([^)]+)/;
const appsWithoutRatingRegex =
  /href="([^"]+)"[^>]+?(?<=data-app-link-details)[^>]*>([^<]+)/;

function collectCategories(html: string) {
  const categories = [...html.matchAll(categoriesRegex)].map((e) => e[1]);

  return categories.filter((e, index) => categories.indexOf(e) === index);
}

interface Options {
  search?: string;
  category?: string;
}

async function collectPageApps(page: Page, options: Options = {}) {
  const { search, category } = {
    search: 'all',
    category: undefined,
    ...options,
  };
  const apps: Partial<AppModel>[] = [];
  let newApps: Partial<AppModel>[] = [];

  for (let index = 1; newApps.length > 0 || index === 1; index++) {
    const response = await page.goto(
      `${shopifyAppsUrl}&q=${search}${
        category ? `&categories%5B%5D=${category}` : ''
      }&page=${index}`
    );
    await page.waitForLoadState('networkidle');

    const html = (await page.content()).replace(/\r|\n/g, '');
    const tooManyRequests = response.status() === 429;

    if (tooManyRequests) {
      console.info('Too many requests waiting 1 minute');
      await new Promise((resolve) => setTimeout(resolve, 60000));
      index--;
    } else {
      const blocks = [...html.matchAll(appsBlockRegex)].map((e) => e[0]);
      const matchs = blocks.map(
        (e) => e.match(appsRegex) || e.match(appsWithoutRatingRegex)
      );

      newApps = matchs.map((e) => {
        return {
          handle: e[1].replace(shopifyAppsRootUrl + '/', '').split('?')[0],
          name: e[2].trim(),
          rating: e[3] ? parseFloat(e[3].replace(',', '.')) : undefined,
          reviewsCount: e[4] ? parseInt(e[4].replace(/,/g, '')) : undefined,
          category,
        };
      });

      if (newApps.length > 0) await updateApps(newApps);
      console.info('new apps updated', newApps.length);
      apps.push(...newApps);
    }
  }
  return apps;
}

const keywords = ['reviews', 'dropshipping', 'cart', 'upsell', 'email', 'seo'];

export async function collectApps() {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext({ locale: 'en' });

  const page = await context.newPage();

  await page.goto(`${shopifyAppsUrl}&q=all`);
  await page.waitForLoadState('networkidle');

  const categories = collectCategories(await page.content());

  console.info('categories', categories);
  for (const keyword of keywords) {
    for (const category of categories) {
      await collectPageApps(page, { search: keyword, category });
    }
  }
  console.info('Done CollectApps!');
}
