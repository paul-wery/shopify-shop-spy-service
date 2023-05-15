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
var proxy_exports = {};
__export(proxy_exports, {
  PoolRequest: () => PoolRequest,
  poolRequest: () => poolRequest
});
module.exports = __toCommonJS(proxy_exports);
var import_axios = __toESM(require("axios"));
var import_uuid = require("uuid");
const { PROXY_USERNAME, PROXY_PASSWORD } = process.env;
class PoolRequest {
  _MAX_REQUESTS_BY_ID = 50;
  _sessionId;
  _requestsCount;
  _logs = [];
  constructor() {
    this._switchSession();
  }
  _switchSession() {
    console.info("Switching session");
    this._logs.push({
      sessionId: this._sessionId,
      requestsCount: this._requestsCount
    });
    this._sessionId = (0, import_uuid.v4)().replace(/-/g, "");
    this._requestsCount = 0;
  }
  get(url) {
    this._requestsCount++;
    if (this._requestsCount >= this._MAX_REQUESTS_BY_ID) {
      this._switchSession();
    }
    try {
      return (0, import_axios.default)(url, {
        proxy: {
          protocol: "http",
          host: "zproxy.lum-superproxy.io",
          port: 22225,
          auth: {
            // username: `${PROXY_USERNAME}-session-${this._sessionId}`,
            username: `${PROXY_USERNAME}`,
            password: PROXY_PASSWORD
          }
        }
      });
    } catch (error) {
      console.error(error.message);
      if (error.message.includes("430")) {
        this._switchSession();
      }
    }
    return;
  }
  getLogs() {
    return this._logs;
  }
}
const poolRequest = new PoolRequest();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PoolRequest,
  poolRequest
});
//# sourceMappingURL=index.js.map
