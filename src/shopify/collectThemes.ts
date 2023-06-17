import { getThemesCollection } from '@src/mongodb/collections';
import { ShopifyTheme } from '@src/types/shopifyTheme';
import axios from 'axios';

const shopifyThemesRootUrl = 'https://themes.shopify.com';
const shopifyThemesUrl = `${shopifyThemesRootUrl}/themes?page=`;
const themesCounterRegex = /\d+\s*-\s*(\d+)\s*of\s*(\d+)\s*themes/;
const themesDataRegex = /data-theme-id="([^"]+)".+?(?<=href)="([^"]+)"/g;

export async function collectThemes() {
  let allThemesChecked = false;
  const themes: ShopifyTheme[] = [];

  for (let index = 1; !allThemesChecked; index++) {
    const pageUrl = `${shopifyThemesUrl}${index}`;
    const response = await axios.get(pageUrl);
    const json = response.data as string;

    const [, currentThemesCountStr, maxThemesCountStr] =
      json.match(themesCounterRegex);
    const currentThemesCount = Number(currentThemesCountStr);
    const maxThemesCount = Number(maxThemesCountStr);
    const themesData = json.matchAll(themesDataRegex);

    for (const [, themeId, themeUrl] of themesData) {
      if (!themes.find((t) => t.id === themeId)) {
        themes.push({ id: themeId, url: `${shopifyThemesRootUrl}${themeUrl}` });
      }
    }

    if (currentThemesCount >= maxThemesCount) allThemesChecked = true;
  }

  const themesCollection = getThemesCollection();

  await Promise.all(
    themes.map((theme) =>
      themesCollection.updateOne(
        { id: theme.id },
        { $set: { id: theme.id, url: theme.url.split('?')[0] } },
        { upsert: true }
      )
    )
  );
  console.info(`[ collectThemes ] ${themes.length} themes collected`);
}
