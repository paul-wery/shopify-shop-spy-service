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
var convertToObjectId_exports = {};
__export(convertToObjectId_exports, {
  convertToObjectId: () => convertToObjectId
});
module.exports = __toCommonJS(convertToObjectId_exports);
var import_mongodb = require("mongodb");
const MONGODB_ID_LENGTH = 24;
function convertToObjectId(id) {
  return new import_mongodb.ObjectId(id.padStart(MONGODB_ID_LENGTH, "0"));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertToObjectId
});
//# sourceMappingURL=convertToObjectId.js.map
