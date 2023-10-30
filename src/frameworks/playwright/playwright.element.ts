import { actionOptions } from "../../types/interfaces/baseActionoptions";
import { baseConfig } from "../../types/interfaces/baseConfig";
import { IBaseElement } from "../../types/interfaces/baseElement";
import { Locator } from "playwright";
import { getActionOptionsFromConfig, safeRun } from "../common/utils";

export class PlaywrightSelector implements IBaseElement {
  private actionOptions: actionOptions;
  constructor(public locator: Locator, private config: baseConfig) {
    this.actionOptions = getActionOptionsFromConfig(this.config);
    this.locator = locator;
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

  public async getText(options?: actionOptions): Promise<string> {
    return await safeRun(
      {
        message: `Getting text from element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        return await this.locator.innerText();
      }
    );
  }

  public async clear(options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: `Clearing element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await this.locator.clear();
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
        await this.locator.click({ button: "right" });
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
        await this.locator.dblclick();
      }
    );
  }
  public async selectOption(options: string | number): Promise<void> {
    return await safeRun(
      {
        message: `Selecting option ${options}`,
        ...this.actionOptions,
      },
      async () => {
        await this.locator.selectOption(options.toString());
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
        return await this.locator.inputValue();
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
        return await this.locator.isEnabled();
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
        return await this.locator.isVisible();
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
        return await this.locator.isChecked();
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
        return await this.locator.getAttribute(name);
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
        return await this.locator.getAttribute(property).toString();
      }
    );
  }

  public async getLocation(
    options?: actionOptions
  ): Promise<{ x: number; y: number }> {
    return await safeRun(
      {
        message: `Getting location from element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        const boundingBox = (await this.locator.boundingBox()) as {
          x: number;
          y: number;
        };
        if (!boundingBox) {
          throw new Error(`Element is not visible`);
        }
        return { x: boundingBox.x, y: boundingBox.y };
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
        return await this.locator.getAttribute("tag_name").toString();
      }
    );
  }

  public async submit(options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: `Submitting element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await this.locator.evaluate((e: any) => {
          e.submit();
        });
      }
    );
  }

  public async hover(options?: actionOptions): Promise<void> {
    return await safeRun(
      {
        message: `Hovering element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await this.locator.hover();
      }
    );
  }

  public async dragAndDrop(
    target: PlaywrightSelector,
    options?: actionOptions
  ): Promise<void> {
    return await safeRun(
      {
        message: `Dragging and dropping element`,
        ...this.actionOptions,
        ...options,
      },
      async () => {
        await this.locator.dragTo(target.locator);
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
        await this.locator.screenshot({ path: filePath });
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
        await this.locator.waitFor();
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
        return await this.locator.count();
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
        return await this.locator.innerHTML();
      }
    );
  }

  public async forEach(
    callback: (element: IBaseElement, index: number) => Promise<void>
  ): Promise<void> {
    const count = await this.locator.count();
    for (let i = 0; i < count; i++) {
      await callback(
        new PlaywrightSelector(this.locator.nth(i), this.config),
        i
      );
    }
  }

  public async filter(
    callback: (element: IBaseElement, index: number) => Promise<boolean>
  ): Promise<IBaseElement[]> {
    const result: IBaseElement[] = [];
    const count = await this.locator.count();
    for (let i = 0; i < count; i++) {
      const element = new PlaywrightSelector(this.locator.nth(i), this.config);
      if (await callback(element, i)) {
        result.push(element);
      }
    }
    return result;
  }

  public async map<T>(
    callback: (element: IBaseElement, index: number) => Promise<T>
  ): Promise<T[]> {
    const result: T[] = [];
    const count = await this.locator.count();
    for (let i = 0; i < count; i++) {
      result.push(
        await callback(
          new PlaywrightSelector(this.locator.nth(i), this.config),
          i
        )
      );
    }
    return result;
  }

  public nth(index: number): PlaywrightSelector {
    return new PlaywrightSelector(this.locator.nth(index), this.config);
  }

  public selector(selector: string): IBaseElement {
    return new PlaywrightSelector(this.locator.locator(selector), this.config);
  }
}
