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
var arrayToChunks_exports = {};
__export(arrayToChunks_exports, {
  arrayToChunks: () => arrayToChunks
});
module.exports = __toCommonJS(arrayToChunks_exports);
function arrayToChunks(array, chunkSize) {
  const chunks = [];
  for (let index = 0; index < array.length; index += chunkSize) {
    const chunk = array.slice(index, index + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  arrayToChunks
});
//# sourceMappingURL=arrayToChunks.js.map
