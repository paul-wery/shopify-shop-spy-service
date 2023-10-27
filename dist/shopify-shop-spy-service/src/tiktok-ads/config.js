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
var config_exports = {};
__export(config_exports, {
  PLAYWRIGHT_CONFIG: () => PLAYWRIGHT_CONFIG
});
module.exports = __toCommonJS(config_exports);
const { PROXY_HOST, PROXY_PORT, PROXY_USERNAME, PROXY_PASSWORD } = process.env;
const PLAYWRIGHT_CONFIG = {
  headless: true,
  chromiumSandbox: false,
  args: ["--disable-blink-features=AutomationControlled", "--no-sandbox"],
  proxy: {
    server: `${PROXY_HOST}:${PROXY_PORT}`,
    username: PROXY_USERNAME,
    password: PROXY_PASSWORD
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PLAYWRIGHT_CONFIG
});
//# sourceMappingURL=config.js.map
