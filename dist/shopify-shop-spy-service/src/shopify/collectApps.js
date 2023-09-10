var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var collectApps_exports = {};
__export(collectApps_exports, {
  collectApps: () => collectApps
});
module.exports = __toCommonJS(collectApps_exports);
var import_updateApp = require("@src/mongodb/updateApp");
var import_playwright = __toESM(require("playwright"));
const shopifyAppsRootUrl = "https://apps.shopify.com";
const shopifyAppsUrl = `${shopifyAppsRootUrl}/search?sort_by=popular`;
const categoriesRegex = /<input.+?(?<=id="categories_").*\svalue="([^"]+)/gm;
const appsBlockRegex = /<a[^>]+?(?<=data-app-link-details).+?(?<=total reviews)/gm;
const appsRegex = /href="([^"]+)"[^>]+?(?<=data-app-link-details)[^>]*>([^<]+).+?(?<=<span>)\s*(\d.\d).+?(?=\(\d)\(([^)]+)/;
const appsWithoutRatingRegex = /href="([^"]+)"[^>]+?(?<=data-app-link-details)[^>]*>([^<]+)/;
function collectCategories(html) {
  const categories = [...html.matchAll(categoriesRegex)].map((e) => e[1]);
  return categories.filter((e, index) => categories.indexOf(e) === index);
}
async function collectPageApps(page, options = {}) {
  const { search, category } = {
    search: "all",
    category: void 0,
    ...options
  };
  const apps = [];
  let newApps = [];
  for (let index = 1; newApps.length > 0 || index === 1; index++) {
    const response = await page.goto(
      `${shopifyAppsUrl}&q=${search}${category ? `&categories%5B%5D=${category}` : ""}&page=${index}`
    );
    await page.waitForLoadState("networkidle");
    const html = (await page.content()).replace(/\r|\n/g, "");
    const tooManyRequests = response.status() === 429;
    if (tooManyRequests) {
      console.info("Too many requests waiting 1 minute");
      await new Promise((resolve) => setTimeout(resolve, 6e4));
      index--;
    } else {
      const blocks = [...html.matchAll(appsBlockRegex)].map((e) => e[0]);
      const matchs = blocks.map(
        (e) => e.match(appsRegex) || e.match(appsWithoutRatingRegex)
      );
      newApps = matchs.map((e) => {
        return {
          handle: e[1].replace(shopifyAppsRootUrl + "/", "").split("?")[0],
          name: e[2].trim(),
          rating: e[3] ? parseFloat(e[3].replace(",", ".")) : void 0,
          reviewsCount: e[4] ? parseInt(e[4].replace(/,/g, "")) : void 0,
          category
        };
      });
      if (newApps.length > 0)
        await (0, import_updateApp.updateApps)(newApps);
      console.info("new apps updated", newApps.length);
      apps.push(...newApps);
    }
  }
  return apps;
}
const keywords = ["reviews", "dropshipping", "cart", "upsell", "email", "seo"];
async function collectApps() {
  const browser = await import_playwright.default.chromium.launch({ headless: false });
  const context = await browser.newContext({ locale: "en" });
  const page = await context.newPage();
  await page.goto(`${shopifyAppsUrl}&q=all`);
  await page.waitForLoadState("networkidle");
  const categories = collectCategories(await page.content());
  console.info("categories", categories);
  for (const keyword of keywords) {
    for (const category of categories) {
      await collectPageApps(page, { search: keyword, category });
    }
  }
  console.info("Done CollectApps!");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  collectApps
});
//# sourceMappingURL=collectApps.js.map
