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
var constants_exports = {};
__export(constants_exports, {
  ACCOUNTS: () => ACCOUNTS,
  NO_ACCOUNTS_ERROR: () => NO_ACCOUNTS_ERROR,
  TIKTOK_ACCOUNTS_POOL: () => TIKTOK_ACCOUNTS_POOL,
  TIKTOK_ROOT: () => TIKTOK_ROOT
});
module.exports = __toCommonJS(constants_exports);
const TIKTOK_ROOT = "https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en";
const ACCOUNTS = JSON.parse(process.env.GOOGLE_ACCOUNTS).array;
const TIKTOK_ACCOUNTS_POOL = ACCOUNTS.map((e) => ({
  ...e,
  blocked: false
}));
const NO_ACCOUNTS_ERROR = "Login with Google: Failed - No valid accounts";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ACCOUNTS,
  NO_ACCOUNTS_ERROR,
  TIKTOK_ACCOUNTS_POOL,
  TIKTOK_ROOT
});
//# sourceMappingURL=index.js.map
