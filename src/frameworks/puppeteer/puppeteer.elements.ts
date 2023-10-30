import { actionOptions } from "../../types/interfaces/baseActionoptions";
import { baseConfig } from "../../types/interfaces/baseConfig";
import { IBaseElement } from "../../types/interfaces/baseElement";
import { Locator, ElementHandle, Page } from "puppeteer";
import { getActionOptionsFromConfig, safeRun } from "../common/utils";

export class PuppeteerSelector implements IBaseElement {
  private actionOptions: actionOptions;
  constructor(
    private locator: Locator<any>,
    private config: baseConfig,
    private elementHandle:
      | Promise<ElementHandle<Element>>
      | ElementHandle<Element>,
    private page: Page,
    private selectorString: string
  ) {
    this.actionOptions = getActionOptionsFromConfig(this.config);
    this.locator = locator;
    this.elementHandle = elementHandle;
    this.page = page;
    this.selectorString = selectorString;
  }

  public async click(options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: `Clicking on element`, ...this.actionOptions, ...options },
      async () => {
        await this.locator.click();
      }
    );
  }

  public async fill(text: string, options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: `Filling element with ${text}`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await this.locator.fill(text);
      }
    );
  }

  public async clear(options?: actionOptions): Promise<void> {
    return await safeRun(
      { message: `Clearing element`, ...this.actionOptions, ...options },
      async () => {
        await this.locator.fill("");
      }
    );
  }

  public async getText(options?: actionOptions): Promise<string> {
    return await safeRun(
      {
        message: `Getting text from element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return (
          await (await this.elementHandle).getProperty("innerText")
        ).toString();
      }
    );
  }

  public async rightClick(options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: `Right clicking on element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await (await this.elementHandle).click({ button: "right" });
      }
    );
  }

  public async doubleClick(options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: `Double clicking on element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await this.locator.click({ clickCount: 2 });
        //await this.elementHandle.click({clickCount: 2});
      }
    );
  }

  public async selectOption(options: string | number): Promise<void> {
    return await safeRun(
      {
        message: `Selecting option ${options} from element`,
        ...this.actionOptions,
      },
      async () => {
        await this.locator.click();
      }
    );
  }

  public async getValue(options?: actionOptions): Promise<string> {
    return await safeRun(
      {
        message: `Getting value from element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return (
          await (await this.elementHandle).getProperty("value")
        ).toString();
      }
    );
  }

  public async isEnabled(options?: actionOptions): Promise<boolean> {
    return await safeRun(
      {
        message: `Checking if element is enabled`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return await this.page.$eval("button", (button) => {
          return button.disabled;
        });
      }
    );
  }

  public async isVisible(options?: actionOptions): Promise<boolean> {
    return await safeRun(
      {
        message: `Checking if element is visible`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return !!(await (await this.elementHandle).boundingBox());
      }
    );
  }

  public async isSelected(options?: actionOptions): Promise<boolean> {
    return await safeRun(
      {
        message: `Checking if element is selected`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return !!(
          await (await this.elementHandle).getProperty("checked")
        ).jsonValue();
      }
    );
  }

  public async getAttribute(
    name: string,
    options?: actionOptions
  ): Promise<string | null> {
    return await safeRun(
      {
        message: `Getting attribute ${name} from element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return (await (await this.elementHandle).getProperty(name)).toString();
      }
    );
  }

  public async getCssValue(
    property: string,
    options?: actionOptions
  ): Promise<string> {
    return await safeRun(
      {
        message: `Getting css value ${property} from element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return await this.page.$eval(
          this.selectorString,
          (el, property) => {
            return window.getComputedStyle(el).getPropertyValue(property);
          },
          property
        );
      }
    );
  }

  public async getTagName(options?: actionOptions): Promise<string> {
    return await safeRun(
      {
        message: `Getting tag name from element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return (
          await (await this.elementHandle).getProperty("tagName")
        ).toString();
      }
    );
  }

  public async hover(options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: `Hovering over element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await (await this.elementHandle).hover();
      }
    );
  }

  public async takeScreenshot(
    filePath: string,
    options?: actionOptions
  ): Promise<void> {
    return await safeRun(
      {
        message: `Taking screenshot of element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await (await this.elementHandle).screenshot({ path: filePath });
      }
    );
  }

  public async count(options?: actionOptions): Promise<number> {
    return await safeRun(
      {
        message: `Counting elements`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return (await this.page.$$(this.selectorString)).length;
      }
    );
  }

  public async waitForElement(options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: `Waiting for element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await this.page.waitForSelector(this.selectorString);
      }
    );
  }

  public async getHTML(options?: actionOptions): Promise<string> {
    return await safeRun(
      {
        message: `Getting HTML from element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return await this.page.$eval(this.selectorString, (el) => el.innerHTML);
      }
    );
  }

  public async forEach(
    callback: (element: IBaseElement, index: number) => Promise<void>,
    options?: actionOptions
  ): Promise<void> {
    return await safeRun(
      {
        message: `Iterating over elements`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        const elements = await this.page.$$(this.selectorString);
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          await callback(
            new PuppeteerSelector(
              this.page.$(this.selectorString) as any,
              this.config,
              element,
              this.page,
              this.selectorString
            ) as any as IBaseElement,
            i
          );
        }
      }
    );
  }

  public async filter(
    callback: (element: IBaseElement, index: number) => Promise<boolean>,
    options?: actionOptions
  ): Promise<IBaseElement[]> {
    return await safeRun(
      {
        message: `Filtering elements`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        const elements = await this.page.$$(this.selectorString);
        const filteredElements: IBaseElement[] = [];
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const result = await callback(
            new PuppeteerSelector(
              this.page.$(this.selectorString) as any,
              this.config,
              element,
              this.page,
              this.selectorString
            ) as any as IBaseElement,
            i
          );
          if (result) filteredElements.push(element as any as IBaseElement);
        }
        return filteredElements;
      }
    );
  }

  public async map<T>(
    callback: (element: IBaseElement, index: number) => Promise<T>,
    options?: actionOptions
  ): Promise<T[]> {
    return await safeRun(
      {
        message: `Mapping elements`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        const elements = await this.page.$$(this.selectorString);
        const mappedElements: T[] = [];
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          mappedElements.push(
            await callback(
              new PuppeteerSelector(
                this.page.$(this.selectorString) as any,
                this.config,
                element,
                this.page,
                this.selectorString
              ) as any as IBaseElement,
              i
            )
          );
        }
        return mappedElements;
      }
    );
  }

  public nth(index: number): IBaseElement {
    return new PuppeteerSelector(
      this.page.$(this.selectorString) as any,
      this.config,
      (this.page.$$(this.selectorString) as any)[
        index
      ] as any as ElementHandle<Element>,
      this.page,
      this.selectorString
    ) as any as IBaseElement;
  }

  public selector(selector: string): IBaseElement {
    return new PuppeteerSelector(
      this.page.$(this.selectorString) as any,
      this.config,
      this.page.$(selector) as any,
      this.page,
      selector
    ) as any as IBaseElement;
  }
}
