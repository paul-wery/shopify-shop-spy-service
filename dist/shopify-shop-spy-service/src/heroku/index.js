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
var heroku_exports = {};
__export(heroku_exports, {
  getDynos: () => getDynos,
  startDyno: () => startDyno,
  stopDynos: () => stopDynos
});
module.exports = __toCommonJS(heroku_exports);
var import_axios = __toESM(require("axios"));
const HEROKU_APP = process.env.HEROKU_APP;
const HEROKU_TOKEN = process.env.HEROKU_TOKEN;
const options = {
  headers: {
    Accept: "application/vnd.heroku+json; version=3",
    Authorization: `Bearer ${HEROKU_TOKEN}`
  }
};
const command = "npm run start";
async function getDynos() {
  try {
    const response = await (0, import_axios.default)(
      `https://api.heroku.com/apps/${HEROKU_APP}/dynos`,
      options
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function stopDynos() {
  try {
    const dynos = await getDynos();
    for (const dyno of dynos) {
      await import_axios.default.post(
        `https://api.heroku.com/apps/${HEROKU_APP}/dynos/${dyno.id}/actions/stop`,
        {},
        options
      );
    }
  } catch (error) {
    console.error(error);
  }
}
async function startDyno() {
  try {
    await import_axios.default.post(
      `https://api.heroku.com/apps/${HEROKU_APP}/dynos`,
      { command },
      options
    );
  } catch (error) {
    console.error(error);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDynos,
  startDyno,
  stopDynos
});
//# sourceMappingURL=index.js.map
