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
var collectThemes_exports = {};
__export(collectThemes_exports, {
  collectThemes: () => collectThemes
});
module.exports = __toCommonJS(collectThemes_exports);
var import_collections = require("@src/mongodb/collections");
var import_axios = __toESM(require("axios"));
const shopifyThemesRootUrl = "https://themes.shopify.com";
const shopifyThemesUrl = `${shopifyThemesRootUrl}/themes?page=`;
const themesCounterRegex = /\d+\s*-\s*(\d+)\s*of\s*(\d+)\s*themes/;
const themesDataRegex = /data-theme-id="([^"]+)".+?(?<=href)="([^"]+)"/g;
async function collectThemes() {
  let allThemesChecked = false;
  const themes = [];
  for (let index = 1; !allThemesChecked; index++) {
    const pageUrl = `${shopifyThemesUrl}${index}`;
    const response = await import_axios.default.get(pageUrl);
    const json = response.data;
    const [, currentThemesCountStr, maxThemesCountStr] = json.match(themesCounterRegex);
    const currentThemesCount = Number(currentThemesCountStr);
    const maxThemesCount = Number(maxThemesCountStr);
    const themesData = json.matchAll(themesDataRegex);
    for (const [, themeId, themeUrl] of themesData) {
      if (!themes.find((t) => t.id === themeId)) {
        themes.push({ id: themeId, url: `${shopifyThemesRootUrl}${themeUrl}` });
      }
    }
    if (currentThemesCount >= maxThemesCount)
      allThemesChecked = true;
  }
  const themesCollection = (0, import_collections.getThemesCollection)();
  await Promise.all(
    themes.map(
      (theme) => themesCollection.updateOne(
        { id: theme.id },
        { $set: { id: theme.id, url: theme.url.split("?")[0] } },
        { upsert: true }
      )
    )
  );
  console.info(`[ collectThemes ] ${themes.length} themes collected`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  collectThemes
});
//# sourceMappingURL=collectThemes.js.map
