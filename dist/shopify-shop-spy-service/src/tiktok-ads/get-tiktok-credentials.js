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
var get_tiktok_credentials_exports = {};
__export(get_tiktok_credentials_exports, {
  getTiktokCredentials: () => getTiktokCredentials
});
module.exports = __toCommonJS(get_tiktok_credentials_exports);
var import_constants = require("@src/constants/index");
var import_fs = __toESM(require("fs"));
var import_playwright_extra = require("playwright-extra");
var import_puppeteer_extra_plugin_stealth = __toESM(require("puppeteer-extra-plugin-stealth"));
var import_config = require("./config");
var import_utils = require("./utils");
import_playwright_extra.chromium.use((0, import_puppeteer_extra_plugin_stealth.default)());
async function extractCredentials(page) {
  await page.goto(import_constants.TIKTOK_ROOT);
  return new Promise((resolve) => {
    page.on("request", (request) => {
      if (request.url().includes("list?")) {
        const headers = request.headers();
        const webId = headers["web-id"];
        const userSign = headers["user-sign"];
        const timestamp = headers["timestamp"];
        resolve({ webId, userSign, timestamp });
      }
    });
  });
}
async function loginWithGoogle(context, page) {
  const credentials = (0, import_utils.getRandomAccount)(
    import_constants.TIKTOK_ACCOUNTS_POOL.filter((e) => !e.blocked)
  );
  if (!credentials)
    return false;
  const { email, password } = credentials;
  await page.goto(import_constants.TIKTOK_ROOT);
  await page.waitForLoadState("domcontentloaded");
  await page.click('text="Log in"');
  await page.click('text="Log in with Google"');
  let maxWait = 3;
  while (context.pages().length < 2 && maxWait > 0) {
    await page.waitForTimeout(1e3);
    maxWait--;
  }
  if (context.pages().length < 2) {
    return loginWithGoogle(context, page);
  }
  const popup = context.pages()[1];
  await popup.waitForLoadState("networkidle");
  await popup.fill('input[type="email"]', email);
  await popup.keyboard.press("Enter");
  try {
    await popup.fill('input[type="password"]', password, { timeout: 5e3 });
    await popup.keyboard.press("Enter");
  } catch (error) {
    if (await popup.isVisible('text="Try again"') || await popup.isVisible('text="Reintentar"')) {
      credentials.blocked = true;
      await popup.close();
      return loginWithGoogle(context, page);
    } else
      throw error;
  }
  await popup.waitForLoadState("networkidle");
  if (await popup.isVisible('input[type="tel"]') || await popup.isVisible('text="Recover account"') || await popup.isVisible('text="Recuperar la cuenta"')) {
    credentials.blocked = true;
    await popup.close();
    return loginWithGoogle(context, page);
  }
  return true;
}
async function getTiktokCredentials() {
  console.info("Get Tiktok Credentials");
  const browser = await import_playwright_extra.chromium.launch(import_config.PLAYWRIGHT_CONFIG);
  let credentials = null;
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  try {
    console.log("Login with Google");
    const success = await loginWithGoogle(context, page);
    if (!success)
      throw new Error(import_constants.NO_ACCOUNTS_ERROR);
    console.log("Login with Google: Done");
    console.log("extractCredentials");
    credentials = await extractCredentials(page);
    console.info("Get Tiktok Credentials: Done");
  } catch (error) {
    console.error("Get Tiktok Credentials: Failed");
    if (error.message === import_constants.NO_ACCOUNTS_ERROR)
      throw error;
    console.error(error);
    import_fs.default.writeFileSync("./error.html", await context.pages()[1].content());
  } finally {
    await browser.close();
  }
  return credentials;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTiktokCredentials
});
//# sourceMappingURL=get-tiktok-credentials.js.map
