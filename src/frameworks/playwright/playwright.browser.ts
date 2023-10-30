import {
  BrowserContext,
  Page,
  Browser,
  chromium,
  firefox,
  webkit,
} from "playwright";
import { IBaseBrowser } from "../../types/interfaces/baseBrowser";
import { PlaywrightSelector } from "./playwright.element";
import { IBaseElement } from "../../types/interfaces/baseElement";
import { actionOptions } from "../../types/interfaces/baseActionoptions";
import { getActionOptionsFromConfig, safeRun } from "../common/utils";
import { baseConfig, configOverrides } from "../../types/interfaces/baseConfig";

export class PlaywrightBrowser implements IBaseBrowser {
  private config: baseConfig;
  private actionOptions: actionOptions;
  private tabs: Page[] = [];
  private currentTab: number = 0;

  private constructor(
    private browser: Browser,
    private context: BrowserContext,
    private page: Page,
    config: baseConfig
  ) {
    this.browser = browser;
    this.context = context;
    this.page = page;
    this.tabs.push(this.page);
    this.config = config;
    this.actionOptions = getActionOptionsFromConfig(this.config);
  }

  static async init(): Promise<IBaseBrowser> {
    const config = configOverrides();
    let browser;
    switch (config.browser) {
      case "chromium":
        browser = await chromium.launch({
          headless: config.headless,
          timeout: config.actionTimeout,
        });
        break;
      case "firefox":
        browser = await firefox.launch({
          headless: config.headless,
          timeout: config.actionTimeout,
        });
        break;
      case "webkit":
        browser = await webkit.launch({
          headless: config.headless,
          timeout: config.actionTimeout,
        });
        break;
      default:
        throw new Error(
          `Browser ${config.browser} is not supported for playwright`
        );
    }
    const context = await browser.newContext();
    const page = await context.newPage();
    return new PlaywrightBrowser(browser, context, page, config);
  }

  public selector(selector: string): IBaseElement {
    return new PlaywrightSelector(this.page.locator(selector), this.config);
  }

  public async navigateTo(url: string, options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: `Navigating to ${url}`, ...this.actionOptions, ...options },
      async () => {
        await this.page.goto(url);
      }
    );
  }

  public async getUrl(options?: actionOptions): Promise<string> {
    return await safeRun(
      { message: "Getting URL", ...this.actionOptions, ...options },
      async () => {
        return await this.page.url();
      }
    );
  }

  public async closeBrowser(options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: "Closing browser", ...this.actionOptions, ...options },
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
        this.page = newPage;
        if (url) await this.page.goto(url);
      }
    );
  }

  public async closeTab(options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: "Closing tab", ...this.actionOptions, ...options },
      async () => {
        await this.page.close();
        if (this.tabs.length === 0) {
          await this.context.close();
          await this.browser.close();
        }
        //remove the closed tab from the tabs array
        this.tabs.splice(this.currentTab, 1);
        this.currentTab = this.tabs.length - 1;
        this.page = this.tabs[this.currentTab];
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
            await this.page.mouse.dblclick(coords.x, coords.y);
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
            await this.page.keyboard.press(key);
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
            const alert = await this.page.waitForEvent("dialog");
            await alert.accept();
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
            const alert = await this.page.waitForEvent("dialog");
            await alert.dismiss();
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
            const alert = await this.page.waitForEvent("dialog");
            return alert.message();
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
            const alert = await this.page.waitForEvent("dialog");
            await alert.accept(keys);
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
            await this.page.waitForLoadState();
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
