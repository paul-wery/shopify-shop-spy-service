import { Page } from 'playwright-chromium';

export function waitForPageChange(page: Page): Promise<void> {
  const currentUrl = page.url();

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (page.url() !== currentUrl) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}
