import { LaunchOptions } from 'playwright-chromium';

const { PROXY_HOST, PROXY_PORT, PROXY_USERNAME, PROXY_PASSWORD } = process.env;

export const PLAYWRIGHT_CONFIG: LaunchOptions = {
  headless: true,
  chromiumSandbox: false,
  args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  proxy: {
    server: `${PROXY_HOST}:${PROXY_PORT}`,
    username: PROXY_USERNAME,
    password: PROXY_PASSWORD,
  },
};
