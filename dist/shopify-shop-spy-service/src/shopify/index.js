var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var shopify_exports = {};
__export(shopify_exports, {
  startCollectThemes: () => startCollectThemes,
  startSpyShops: () => startSpyShops
});
module.exports = __toCommonJS(shopify_exports);
var import_getShops = require("@src/mongodb/getShops");
var import_node_schedule = require("node-schedule");
var import_spyShop = require("./spyShop");
var import_conf = require("@src/mongodb/conf");
var import_collectThemes = require("./collectThemes");
const startCollectThemes = async () => {
  const rule = new import_node_schedule.RecurrenceRule();
  rule.hour = 0;
  rule.minute = 0;
  const job = (0, import_node_schedule.scheduleJob)(rule, async () => {
    await import_conf.client.connect();
    console.log("RUNNING startCollectThemes");
    await (0, import_collectThemes.collectThemes)();
  });
  return job;
};
const startSpyShops = async () => {
  const rule = new import_node_schedule.RecurrenceRule();
  rule.second = new import_node_schedule.Range(0, 59, 60);
  const job = (0, import_node_schedule.scheduleJob)(rule, async () => {
    await import_conf.client.connect();
    console.log("RUNNING startSpyShops");
    const shops = await (0, import_getShops.getShops)();
    for (let index = 0; index < shops.length; index++) {
      const shop = shops[index];
      (0, import_spyShop.spyShop)(shop);
    }
  });
  return job;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startCollectThemes,
  startSpyShops
});
//# sourceMappingURL=index.js.map
