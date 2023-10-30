import { frameworkSelector } from "./frameworks/frameworkFascade";

(async () => {
  const browser = await frameworkSelector.playwright();
  await browser.navigateTo("https://www.google.com");
  await browser.openTab("https://www.bing.com");
  console.log(await browser.getUrl());
  await browser.closeBrowser();
})();
