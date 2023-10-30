import { IBaseBrowser } from "../types/interfaces/baseBrowser";
import { PlaywrightBrowser } from "./playwright/playwright.browser";
import { PuppeteerBrowser } from "./puppeteer/puppeteer.browser";

export class frameworkSelector {
  static async playwright() : Promise<IBaseBrowser>{
    return await PlaywrightBrowser.init();
  }
/*   static async puppeteer(): Promise<IBaseBrowser> {
    return await PuppeteerBrowser.init();
  } */

    /*  static selenium() : IBaseBrowser{
    }
  } */
}
