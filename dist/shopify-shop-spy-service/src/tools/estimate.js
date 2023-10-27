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
var estimate_exports = {};
__export(estimate_exports, {
  estimateBudget: () => estimateBudget,
  estimateViews: () => estimateViews
});
module.exports = __toCommonJS(estimate_exports);
const LIKES_VIEWS_RATIO = 100;
const AVERAGE_CPM = 10;
function estimateViews(likes) {
  return likes * LIKES_VIEWS_RATIO;
}
function estimateBudget(likes) {
  return estimateViews(likes) / 1e3 * AVERAGE_CPM;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  estimateBudget,
  estimateViews
});
//# sourceMappingURL=estimate.js.map
