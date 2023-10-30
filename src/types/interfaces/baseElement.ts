import { actionOptions } from "./baseActionoptions";

export interface IBaseElement {
  /*  isIframe: boolean;
   */
  /**
   * Clicks the targeted element
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   */
  click: (options?: actionOptions) => Promise<void>;

  /**
   * Fills the targeted element with the specified text
   *
   * @param text - The text to fill into the element
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   */
  fill: (text: string, options?: actionOptions) => Promise<void>;

  /**
   * Clears the value of the targeted element
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   */
  clear: (options?: actionOptions) => Promise<void>;

  /**
   * Retrieves the visible text of the targeted element
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if retrieving the text fails
   *
   * @returns A Promise resolving to the visible text of the element
   */
  getText: (options?: actionOptions) => Promise<string>;

  /**
   * Performs a right-click on the targeted element
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   */
  rightClick: (options?: actionOptions) => Promise<void>;

  /**
   * Performs a double-click on the targeted element
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   */
  doubleClick: (options?: actionOptions) => Promise<void>;

  /**
   * Selects the specified option in the targeted element
   *
   * @param option - The option to select (can be a string or number)
   *
   */
  selectOption: (option: string | number) => Promise<void>;

  /**
   * Retrieves the value of the targeted element
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   * @returns A Promise resolving to the value of the element
   */
  getValue: (options?: actionOptions) => Promise<string>;

  /**
   * Checks if the targeted element is enabled
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   * @returns A Promise resolving to `true` if the element is enabled, `false` otherwise
   */
  isEnabled: (options?: actionOptions) => Promise<boolean>;

  /**
   * Checks if the targeted element is visible in the viewport
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   * @returns A Promise resolving to `true` if the element is visible, `false` otherwise
   */
  isVisible: (options?: actionOptions) => Promise<boolean>;

  /**
   * Checks if the targeted element is selected (e.g., for checkboxes or radio buttons)
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   * @returns A Promise resolving to `true` if the element is selected, `false` otherwise
   */
  isSelected: (options?: actionOptions) => Promise<boolean>;

  /**
   * Retrieves the value of the specified attribute of the targeted element
   *
   * @param name - The name of the attribute to retrieve
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   * @returns A Promise resolving to the value of the attribute, or `null` if the attribute is not found
   */
  getAttribute: (
    name: string,
    options?: actionOptions
  ) => Promise<string | null>;

  /**
   * Retrieves the value of the specified CSS property of the targeted element
   *
   * @param property - The name of the CSS property to retrieve
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   * @returns A Promise resolving to the value of the CSS property
   */
  getCssValue: (property: string, options?: actionOptions) => Promise<string>;

  /**
   * Retrieves the tag name of the targeted element
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   * @returns A Promise resolving to the tag name of the element
   */
  getTagName: (options?: actionOptions) => Promise<string>;

  /**
   * Performs a hover action on the targeted element
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   */
  hover: (options?: actionOptions) => Promise<void>;

  /**
   * Takes a screenshot of the targeted element and saves it to the specified file path
   *
   * @param filePath - The file path to save the screenshot to
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if the action fails
   *
   */
  takeScreenshot: (filePath: string, options?: actionOptions) => Promise<void>;


  /**
   * Counts the number of matching elements that match the targeted element's selector
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if counting fails
   *
   * @returns A Promise resolving to the number of matching elements
   */
  count: (options?: actionOptions) => Promise<number>;

  /**
   * Retrieves the inner HTML of the targeted element
   *
   * @param options.timeout - Timeout in milliseconds
   * @param options.log - Whether to log the action status
   * @param options.throwOnFail - Whether to throw an error if retrieving the HTML fails
   *
   * @returns A Promise resolving to the inner HTML of the element
   */
  getHTML: (options?: actionOptions) => Promise<string>;

  /**
   * Executes the provided callback function for each element in the targeted element's collection
   *
   * @param callback - The callback function to execute for each element
   * @param element - The current element being iterated
   * @param index - The index of the current element being iterated
   *
   * @returns A Promise that resolves when the iteration is complete
   */
  forEach(
    callback: (element: IBaseElement, index: number) => Promise<void>
  ): Promise<void>;

  /**
   * Filters the elements in the targeted element's collection based on the provided callback function
   *
   * @param callback - The callback function to test each element
   * @param element - The current element being tested
   * @param index - The index of the current element being tested
   *
   * @returns A Promise resolving to an array of elements that pass the filter condition
   */
  filter(
    callback: (element: IBaseElement, index: number) => Promise<boolean>
  ): Promise<IBaseElement[]>;

  /**
   * Maps the elements in the targeted element's collection to a new array based on the provided callback function
   *
   * @param callback - The callback function to transform each element
   * @param element - The current element being transformed
   * @param index - The index of the current element being transformed
   *
   * @returns A Promise resolving to an array of transformed elements
   */
  map<T>(
    callback: (element: IBaseElement, index: number) => Promise<T>
  ): Promise<T[]>;

  /**
   * Retrieves the element at the specified index in the targeted element's collection
   *
   * @param index - The index of the element to retrieve
   *
   * @returns The element at the specified index
   */
  nth(index: number): IBaseElement;

  /**
   * Finds element inside the targeted element's collection that matches the provided selector
   *
   * @param selector - The selector to match
   * @param forceSelectorType - The selector type to use
   *
   * @returns The element that matches the provided selector
   *
   */
  selector: (
    selector: string,
    forceSelectorType?: "id" | "class" | "xpath" | "text" | "tag"
  ) => IBaseElement;
}
