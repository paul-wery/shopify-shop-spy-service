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
var collect_exports = {};
__export(collect_exports, {
  collectTiktokAds: () => collectTiktokAds
});
module.exports = __toCommonJS(collect_exports);
var import_estimate = require("@src/tools/estimate");
var import_axios = __toESM(require("axios"));
var import_dayjs = __toESM(require("dayjs"));
const TIKTOK_ADS_URL = "https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/list";
const DEFAULT_PARAMS = {
  keyword: "",
  period: 30,
  limit: 20,
  order_by: "for_you"
};
function convertResponseToTiktokAdModelArray(response, language) {
  const now = (0, import_dayjs.default)().unix();
  return response.data.materials.map((e) => ({
    adId: e.id,
    likes: e.like,
    ctr: e.ctr,
    budgetEnum: e.cost,
    title: e.ad_title,
    brandName: e.brand_name,
    industryKey: e.industry_key,
    industryGroupCode: e.industry_key.replace("label_", "").slice(0, 2),
    language,
    objectiveKey: e.objective_key,
    videoInfo: {
      id: e.video_info.vid,
      cover: e.video_info.cover,
      urls: e.video_info.video_url,
      width: e.video_info.width,
      height: e.video_info.height,
      duration: e.video_info.duration
    },
    views: (0, import_estimate.estimateViews)(e.like),
    budget: (0, import_estimate.estimateBudget)(e.like),
    updatedAt: now,
    createdAt: now
  }));
}
function transformIndustryCode(code) {
  const shape = "00000000000";
  return code + shape.slice(code.length);
}
async function _collectTiktokAds(_params) {
  const params = { ...DEFAULT_PARAMS, ..._params };
  const url = new URL(TIKTOK_ADS_URL);
  url.searchParams.append("period", String(params.period));
  if (params.keyword)
    url.searchParams.append("keyword", params.keyword);
  url.searchParams.append("page", String(params.page));
  url.searchParams.append("limit", String(params.limit));
  url.searchParams.append("order_by", params.order_by);
  if (params.country_code)
    url.searchParams.append("country_code", params.country_code);
  if (params.ad_language)
    url.searchParams.append("ad_language", params.ad_language);
  url.searchParams.append("industry", transformIndustryCode(params.industry));
  const response = await import_axios.default.get(url.href, {
    headers: {
      "user-sign": params.credentials.userSign,
      "web-id": params.credentials.webId,
      timestamp: params.credentials.timestamp
    }
  });
  if (!response.data.data) {
    console.error(`Error: ${response}`);
    console.error(`Code: ${response.data?.code}`);
    console.error(`Message: ${response.data?.msg}`);
  }
  const data = response.data;
  const pagination = data.data.pagination;
  return {
    data: convertResponseToTiktokAdModelArray(data, params.ad_language),
    pagination
  };
}
const MAX_RETRY = 3;
async function collectTiktokAds(_params, retry = 0) {
  if (retry)
    console.info(`Retrying collectTiktokAds... (${retry})`);
  try {
    return await _collectTiktokAds(_params);
  } catch {
    if (retry >= MAX_RETRY)
      throw new Error("Max retry collectTiktokAds reached");
    return await collectTiktokAds(_params, retry + 1);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  collectTiktokAds
});
//# sourceMappingURL=collect.js.map
