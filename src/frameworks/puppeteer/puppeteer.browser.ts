import puppeteer, { BrowserContext, Browser, Page, KeyInput } from "puppeteer";
import { IBaseBrowser } from "../../types/interfaces/baseBrowser";
import { IBaseElement } from "../../types/interfaces/baseElement";
import { actionOptions } from "../../types/interfaces/baseActionoptions";
import { getActionOptionsFromConfig, safeRun } from "../common/utils";
import { baseConfig, configOverrides } from "../../types/interfaces/baseConfig";
import { PuppeteerSelector } from "./puppeteer.elements";

export class PuppeteerBrowser implements IBaseBrowser {
  private config: baseConfig;
  private actionOptions: actionOptions;
  private tabs: Page[] = [];
  private currentTab: number = 0;

  private constructor(
    private context: BrowserContext,
    private page: Page,
    private browser: Browser,
    config: baseConfig
  ) {
    this.browser = browser;
    this.context = context;
    this.page = page;
    this.tabs.push(this.page);
    this.config = config;
    this.actionOptions = getActionOptionsFromConfig(this.config);
  }

  public static async init(): Promise<IBaseBrowser> {
    const config = configOverrides();
    const browser = await puppeteer.launch({
      headless: config.headless,
      timeout: config.actionTimeout,
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    return new PuppeteerBrowser(context, page, browser, config);
  }

  public async $eval<T>(
    callBack: (arg: any) => T,
    arg: any,
    options: actionOptions
  ): Promise<T> {
    return await safeRun(
      { message: "Evaluating callback", ...this.actionOptions, ...options },
      async () => {
        return await this.page.evaluate(callBack, arg);
      }
    );
  }

  public selector(selector: string): IBaseElement {
    return new PuppeteerSelector(
      this.page.locator(selector),
      this.config,
      this.page.$(selector) as any,
      this.page,
      selector
    ) as any as IBaseElement;
  }

  public async navigateTo(url: string, options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: "Navigating to ${url}",
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await this.page.goto(url);
      }
    );
  }

  public async getUrl(options?: actionOptions): Promise<string> {
    return await safeRun(
      {
        message: "Getting url",
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return await this.page.url();
      }
    );
  }
  public async switchToTab(
    tabNumber: number,
    options?: actionOptions
  ): Promise<void> {
    return await safeRun(
      {
        message: `Switching to tab ${tabNumber}`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        if (tabNumber < 0 || tabNumber > this.tabs.length - 1)
          throw new Error(`Tab ${tabNumber} does not exist`);
        this.currentTab = tabNumber;
        this.page = this.tabs[this.currentTab];
      }
    );
  }

  public async closeBrowser(options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: "Closing browser",
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await this.browser.close();
      }
    );
  }
  public async navigateBack(options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: "Navigating back", ...this.actionOptions, ...options },
      async () => {
        await this.page.goBack();
      }
    );
  }
  public async navigateForward(options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: "Navigating forward", ...this.actionOptions, ...options },
      async () => {
        await this.page.goForward();
      }
    );
  }

  public async refresh(options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: "Refreshing page", ...this.actionOptions, ...options },
      async () => {
        await this.page.reload();
      }
    );
  }

  public async openTab(url?: string, options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: "Opening new tab", ...this.actionOptions, ...options },
      async () => {
        const newPage = await this.context.newPage();
        this.tabs.push(newPage);
        this.currentTab = this.tabs.length - 1;
        if (url) {
          await this.navigateTo(url);
        }
      }
    );
  }

  public async closeTab(options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: "Closing tab", ...this.actionOptions, ...options },
      async () => {
        await this.tabs[this.currentTab].close();
        this.tabs.splice(this.currentTab, 1);
        this.currentTab = this.tabs.length - 1;
      }
    );
  }

  public async switchTab(
    tabNumber: number,
    options?: actionOptions
  ): Promise<void> {
    return await safeRun(
      { message: "Switching tab", ...this.actionOptions, ...options },
      async () => {
        this.currentTab = tabNumber;
      }
    );
  }

  public get mouseActions() {
    return {
      move: async (
        x: number,
        y: number,
        options?: actionOptions
      ): Promise<void> => {
        return await safeRun(
          {
            message: `Moving mouse to (${x}, ${y})`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.mouse.move(x, y);
          }
        );
      },
      click: async (
        coords: { x: number; y: number },
        options?: actionOptions
      ): Promise<void> => {
        await safeRun(
          {
            message: `Clicking mouse at (${coords.x}, ${coords.y})`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.mouse.click(coords.x, coords.y);
          }
        );
      },
      doubleClick: async (
        coords: { x: number; y: number },
        options?: actionOptions
      ): Promise<void> => {
        await safeRun(
          {
            message: `Double clicking mouse at (${coords.x}, ${coords.y})`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.mouse.click(coords.x, coords.y, { clickCount: 2 });
          }
        );
      },
    };
  }

  public get keyboardActions() {
    return {
      press: async (key: string, options?: actionOptions): Promise<void> => {
        await safeRun(
          {
            message: `Pressing ${key}`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.keyboard.press(key as KeyInput);
          }
        );
      },
    };
  }

  public get scroll() {
    return {
      up: async (options?: actionOptions): Promise<void> => {
        await safeRun(
          {
            message: `Scrolling up`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.keyboard.press("PageUp");
          }
        );
      },
      down: async (options?: actionOptions): Promise<void> => {
        await safeRun(
          {
            message: `Scrolling down`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.keyboard.press("PageDown");
          }
        );
      },
      left: async (options?: actionOptions): Promise<void> => {
        await safeRun(
          {
            message: `Scrolling left`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.keyboard.press("ArrowLeft");
          }
        );
      },
      right: async (options?: actionOptions): Promise<void> => {
        await safeRun(
          {
            message: `Scrolling right`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.keyboard.press("ArrowRight");
          }
        );
      },
    };
  }
  public async waitForEvent(eventName: string, seconds?: number) {
    seconds = seconds || 30;

    // use race to implement a timeout
    return Promise.race([
      // add event listener and wait for event to fire before returning
      this.page.evaluate(function (eventName) {
        return new Promise(function (resolve, reject) {
          document.addEventListener(eventName, function (e) {
            resolve(true); // resolves when the event fires
          });
        });
      }, eventName),

      // if the event does not fire within n seconds, exit
      this.page.waitForTimeout(seconds * 1000),
    ]);
  }
  public get alert() {
    return {
      accept: async (options?: actionOptions): Promise<void> => {
        await safeRun(
          {
            message: `Accepting alert`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            const alert = await this.waitForEvent("dialog");
            await (alert as any).accept();
          }
        );
      },
      dismiss: async (options?: actionOptions): Promise<void> => {
        await safeRun(
          {
            message: `Dismissing alert`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            const alert = await this.waitForEvent("dialog");
            await (alert as any).dismiss();
          }
        );
      },
      getText: async (options?: actionOptions): Promise<string> => {
        return await safeRun(
          {
            message: `Getting alert text`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            const alert = await this.waitForEvent("dialog");
            return (alert as any).message();
          }
        );
      },
      sendKeys: async (
        keys: string,
        options?: actionOptions
      ): Promise<void> => {
        await safeRun(
          {
            message: `Sending keys to alert`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            const alert = await this.waitForEvent("dialog");
            await (alert as any).accept(keys);
          }
        );
      },
    };
  }

  public get waitFor() {
    return {
      pageLoad: async (options?: actionOptions): Promise<void> => {
        await safeRun(
          {
            message: `Waiting for page load`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.waitForNavigation();
          }
        );
      },
      timeout: async (
        timeout: number,
        options?: actionOptions
      ): Promise<void> => {
        await safeRun(
          {
            message: `Waiting for ${timeout}ms`,
            ...this.actionOptions,
            ...options,
          },
          async () => {
            await this.page.waitForTimeout(timeout);
          }
        );
      },
    };
  }
}
