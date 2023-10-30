import { actionOptions } from "./baseActionoptions";
import { IBaseElement } from "./baseElement";

export enum SelectorType {
  id = "id",
  class = "class",
  xpath = "xpath",
  text = "text",
  tag = "tag",
}

export interface IBaseBrowser {
  /**
   * Retrieves an element using the specified selector and optional force selector type
   *
   * @param selector - The selector to locate the element
   * @param forceSelectorType - Optional. The type of selector to use ("id", "class", "xpath", "text", "tag")
   *
   * @returns The selected element
   */
  selector: (
    selector: string,
    forceSelectorType?: SelectorType
  ) => IBaseElement;

  /**
   * Navigates to the specified URL
   *
   * @param url - The URL to navigate to
   *
   * @returns A Promise that resolves when the navigation is complete
   */
  navigateTo: (url: string, options?: actionOptions) => Promise<void>;

  /**
   * Retrieves the current URL of the page
   *
   * @returns A Promise resolving to the current URL
   */
  getUrl: (options?: actionOptions) => Promise<string>;

  /**
   * Closes the browser
   *
   * @returns A Promise that resolves when the browser is closed
   */
  closeBrowser: (options?: actionOptions) => Promise<void>;

  /**
   * Navigates back in the browser history
   *
   * @returns A Promise that resolves when the navigation is complete
   */
  navigateBack: (options?: actionOptions) => Promise<void>;

  /**
   * Navigates forward in the browser history
   *
   * @returns A Promise that resolves when the navigation is complete
   */
  navigateForward: (options?: actionOptions) => Promise<void>;

  /**
   * Refreshes the current page
   *
   * @returns A Promise that resolves when the refresh is complete
   */
  refresh: (options?: actionOptions) => Promise<void>;

  /**
   * Opens a new tab in the browser and optionally navigates to the specified URL
   *
   * @param url - Optional. The URL to navigate to in the new tab
   *
   * @returns A Promise that resolves when the new tab is opened and navigation is complete
   */
  openTab: (url?: string, options?: actionOptions) => Promise<void>;

  /**
   * Closes the current tab in the browser
   *
   * @returns A Promise that resolves when the current tab is closed
   */
  closeTab: (options?: actionOptions) => Promise<void>;

  /**
   * Switches to the tab at the specified index in the browser
   *
   * @param tabIndex - The index of the tab to switch to
   *
   * @returns A Promise that resolves when the tab switch is complete
   */
  switchToTab: (tabIndex: number, options?: actionOptions) => Promise<void>;

  // /**
  //  * Retrieves an element within an iframe using the specified selector and optional force selector type
  //  *
  //  * @param selector - The selector to locate the element within the iframe
  //  * @param forceSelectorType - Optional. The type of selector to use ("id", "class", "xpath", "text", "tag")
  //  *
  //  * @returns The selected element within the iframe
  //  */
  // iframeSelector: (
  //   selector: string,
  //   forceSelectorType?: SelectorType
  // ) => IBaseElement;

  /**
   * Evaluates the provided callback function in the context of the current page and returns the result
   *
   * @param callBack - The callback function to be evaluated
   *
   * @returns A Promise resolving to the result of the evaluation
   */
  $eval<T>(callBack: () => T, arg: any, options: actionOptions): Promise<T>;

  /**
   * Performs mouse actions on the current page
   */
  mouseActions: {
    /**
     * Moves the mouse to the specified coordinates
     *
     * @param x - The x-coordinate to move to
     * @param y - The y-coordinate to move to
     *
     * @returns A Promise that resolves when the mouse movement is complete
     */
    move: (x: number, y: number, options: actionOptions) => Promise<void>;

    /**
     * Clicks the mouse at the specified coordinates or the current mouse position
     *
     * @param coords - Optional. The coordinates to click at
     *
     * @returns A Promise that resolves when the mouse click is complete
     */
    click: (
      coords: { x: number; y: number },
      options?: actionOptions
    ) => Promise<void>;

    /**
     * Performs a double click at the specified coordinates or the current mouse position
     *
     * @param coords - Optional. The coordinates to double click at
     *
     * @returns A Promise that resolves when the double click is complete
     */
    doubleClick: (
      coords: { x: number; y: number },
      options?: actionOptions
    ) => Promise<void>;
  };

  /**
   * Performs keyboard actions on the current page
   */
  keyboardActions: {
    /**
     * Presses the specified key on the keyboard
     *
     * @param key - The key to press
     *
     * @returns A Promise that resolves when the key press is complete
     */
    press: (key: string) => Promise<void>;
  };

  /**
   * Performs scrolling actions on the current page
   */
  scroll: {
    /**
     * Scrolls up by the specified amount of pixels or a default value
     *
     * @param amount - Optional. The amount of pixels to scroll up by
     *
     * @returns A Promise that resolves when the scrolling is complete
     */
    up: (options?: actionOptions) => Promise<void>;

    /**
     * Scrolls down by the specified amount of pixels or a default value
     *
     * @param amount - Optional. The amount of pixels to scroll down by
     *
     * @returns A Promise that resolves when the scrolling is complete
     */
    down: (options?: actionOptions) => Promise<void>;

    /**
     * Scrolls left by the specified amount of pixels or a default value
     *
     * @param amount - Optional. The amount of pixels to scroll left by
     *
     * @returns A Promise that resolves when the scrolling is complete
     */
    left: (options?: actionOptions) => Promise<void>;

    /**
     * Scrolls right by the specified amount of pixels or a default value
     *
     * @param amount - Optional. The amount of pixels to scroll right by
     *
     * @returns A Promise that resolves when the scrolling is complete
     */

    /**
     * Scrolls to the top of the page
     *
     * @param amount - Optional. The amount of pixels to scroll to the top by
     *
     * @returns A Promise that resolves when the scrolling is complete
     */
    right: (options?: actionOptions) => Promise<void>;
  };
  /**
   * Performs actions related to alerts on the current page
   */
  alert: {
    /**
     * Accepts the currently displayed alert
     *
     * @returns A Promise that resolves when the alert is accepted
     */
    accept: () => Promise<void>;

    /**
     * Dismisses the currently displayed alert
     *
     * @returns A Promise that resolves when the alert is dismissed
     */
    dismiss: () => Promise<void>;

    /**
     * Retrieves the text of the currently displayed alert
     *
     * @returns A Promise resolving to the text of the alert
     */
    getText: () => Promise<string>;

    /**
     * Sends the specified text to the currently displayed alert
     *
     * @param text - The text to send to the alert
     *
     * @returns A Promise that resolves when the text is sent to the alert
     */
    sendKeys: (text: string) => Promise<void>;
  };

  /**
   * Performs waiting actions on the current page
   */
  waitFor: {
    /**
     * Waits for the page to finish loading
     *
     * @param timeout - Optional. The timeout duration in milliseconds
     *
     * @returns A Promise that resolves when the page has finished loading
     */
    pageLoad: (options?: actionOptions) => Promise<void>;

    /**
     * Sets a timeout for subsequent actions
     *
     * @param timeout - The timeout duration in milliseconds
     *
     * @returns A Promise that resolves after the timeout duration
     */
    timeout: (timeout: number, options?: actionOptions) => Promise<void>;
  };
}
