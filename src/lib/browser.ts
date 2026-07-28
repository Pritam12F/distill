import puppeteer from "puppeteer";

export const browser = puppeteer.launch({
  headless: true,
  defaultViewport: { width: 1920, height: 1080 },
});
