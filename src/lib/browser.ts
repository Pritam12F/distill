import puppeteer, { Browser } from "puppeteer";

let browser: Browser | undefined;

export const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1920, height: 1080 },
    });

    return browser;
  }

  return browser;
};

export function checkBrowser() {
  return Boolean(browser);
}

export async function closeBrowser() {
  await browser?.close();
  browser = undefined;
}
