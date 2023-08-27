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
var database_exports = {};
__export(database_exports, {
  startComputeProductsSalesAndTurnover: () => startComputeProductsSalesAndTurnover,
  startComputeSalesAndTurnover: () => startComputeSalesAndTurnover
});
module.exports = __toCommonJS(database_exports);
var import_computeProductsSalesAndTurnover = require("@src/mongodb/computeProductsSalesAndTurnover");
var import_computeSalesAndTurnover = require("@src/mongodb/computeSalesAndTurnover");
var import_conf = require("@src/mongodb/conf");
var import_getShops = require("@src/mongodb/getShops");
var import_node_schedule = require("node-schedule");
const startComputeSalesAndTurnover = async () => {
  const job = (0, import_node_schedule.scheduleJob)("0 * * * *", async () => {
    await import_conf.client.connect();
    console.info("RUNNING ComputeSalesAndTurnover");
    const shops = await (0, import_getShops.getShops)();
    for (let index = 0; index < shops.length; index++) {
      const shop = shops[index];
      await (0, import_computeSalesAndTurnover.computeSalesAndTurnover)(shop);
      process.stdout.write(`Processed: ${index + 1}/${shops.length}\r`);
    }
    console.info("DONE ComputeSalesAndTurnover");
  });
  return job;
};
const startComputeProductsSalesAndTurnover = async () => {
  const shops = await (0, import_getShops.getShops)();
  for (let index = 0; index < shops.length; index++) {
    const shop = shops[index];
    await (0, import_computeProductsSalesAndTurnover.computeProductsSalesAndTurnover)(shop);
    process.stdout.write(`Processed: ${index + 1}/${shops.length}\r`);
  }
  console.info("DONE ComputeProductsSalesAndTurnover");
  const job = (0, import_node_schedule.scheduleJob)("0 0 * * *", async () => {
    await import_conf.client.connect();
    console.info("RUNNING ComputeProductsSalesAndTurnover");
    const shops2 = await (0, import_getShops.getShops)();
    for (let index = 0; index < shops2.length; index++) {
      const shop = shops2[index];
      await (0, import_computeProductsSalesAndTurnover.computeProductsSalesAndTurnover)(shop);
      process.stdout.write(`Processed: ${index + 1}/${shops2.length}\r`);
    }
    console.info("DONE ComputeProductsSalesAndTurnover");
  });
  return job;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startComputeProductsSalesAndTurnover,
  startComputeSalesAndTurnover
});
//# sourceMappingURL=database.js.map
