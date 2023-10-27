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
var collect_ad_details_exports = {};
__export(collect_ad_details_exports, {
  collectAdDetails: () => collectAdDetails
});
module.exports = __toCommonJS(collect_ad_details_exports);
var import_axios = __toESM(require("axios"));
const TIKTOK_AD_DETAILS_URL = "https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/detail?material_id=";
async function collectAdDetails(adId, credentials) {
  const url = `${TIKTOK_AD_DETAILS_URL}${adId}`;
  const response = await import_axios.default.get(url, {
    headers: {
      "user-sign": credentials.userSign,
      "web-id": credentials.webId,
      timestamp: credentials.timestamp
    }
  });
  const data = response.data;
  return {
    comments: data.data.comment,
    shares: data.data.share,
    landingPageUrl: data.data.landing_page
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  collectAdDetails
});
//# sourceMappingURL=collect-ad-details.js.map