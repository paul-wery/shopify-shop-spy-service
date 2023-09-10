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
var updateApp_exports = {};
__export(updateApp_exports, {
  updateApps: () => updateApps
});
module.exports = __toCommonJS(updateApp_exports);
var import_collections = require("./collections");
async function updateApps(apps) {
  const collection = (0, import_collections.getAppsCollection)();
  await Promise.all(
    apps.map(
      (app) => collection.updateOne(
        { handle: app.handle },
        { $set: app },
        { upsert: true }
      )
    )
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateApps
});
//# sourceMappingURL=updateApp.js.map
