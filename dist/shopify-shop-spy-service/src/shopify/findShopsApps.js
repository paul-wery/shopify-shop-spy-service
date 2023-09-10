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
var findShopsApps_exports = {};
__export(findShopsApps_exports, {
  findShopsApps: () => findShopsApps
});
module.exports = __toCommonJS(findShopsApps_exports);
var import_collections = require("@src/mongodb/collections");
var import_shop_model = require("@src/types/shop-model");
var import_axios = __toESM(require("axios"));
const appsFromCommentsRegex = /<!-- BEGIN app block: shopify:\/\/apps\/([^/]+)/g;
const appsFromAsyncLoadFunctionRegex = /function\s*asyncLoad\(\)\s*{\s*var\s*urls\s*=\s*\[([^\]]+)/;
function collectAppsFromAsyncLoadFunction(html) {
  try {
    return html.match(appsFromAsyncLoadFunctionRegex)[1].split(",");
  } catch {
    console.error("Error while collecting apps from async load function");
    return [];
  }
}
function collectAppsFromComments(html) {
  return [...html.matchAll(appsFromCommentsRegex)].map((e) => e[1]);
}
async function findShopApps(shopUrl) {
  const html = (await import_axios.default.get(shopUrl)).data.replace(/\r|\n/g, "");
  const apps = {
    fromComments: collectAppsFromComments(html),
    fromAsyncLoadFunction: collectAppsFromAsyncLoadFunction(html)
  };
  return apps;
}
async function findShopsApps() {
  const shopsCollection = (0, import_collections.getShopsCollection)();
  const appsCollection = (0, import_collections.getAppsCollection)();
  const shops = await shopsCollection.find({ status: import_shop_model.ShopStatus.ACTIVE, subscribersCount: { $gt: 0 } }).project({ url: 1 }).toArray();
  const apps = (await appsCollection.find({}).toArray()).map((app) => {
    return {
      ...app,
      flatName: app.name.toLowerCase().replace(/\s|:/g, "-").replace(/[^\x00-\x7F]+/g, "-").replace(/-+/g, "-")
    };
  });
  console.info("Get apps from database :", apps.length);
  console.info("Get shops from database :", shops.length);
  let successCount = 0;
  let errorCount = 0;
  for (const shop of shops) {
    try {
      const foundApps = await findShopApps(shop.url);
      const shopApps = [];
      console.info("Found apps :");
      console.info(foundApps.fromComments);
      for (const foundApp of foundApps.fromComments) {
        const app = apps.find((e) => e.flatName === foundApp);
        if (app) {
          console.info("Found app :", app.name);
          shopApps.push(app._id);
          successCount++;
        } else {
          console.info("Not found app :", foundApp);
          errorCount++;
        }
      }
      await shopsCollection.updateOne(
        { _id: shop._id },
        { $set: { installedApps: shopApps } }
      );
    } catch (error) {
      console.error("Error while finding shop apps :", error.message);
    }
  }
  console.info("Success count :", successCount);
  console.info("Error count :", errorCount);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findShopsApps
});
//# sourceMappingURL=findShopsApps.js.map
