import { config } from "../../config";

export interface baseConfig {
  browser?: "chromium" | "firefox" | "webkit";
  headless?: boolean;
  actionTimeout?: number;
  logs?: boolean;
  throwOnFail?: boolean;
}

export const defaultConfig: baseConfig = {
  browser: "chromium",
  headless: true,
  actionTimeout: 5000,
  logs: true,
  throwOnFail: true,
};


export const configOverrides = (): baseConfig => ({
  ...defaultConfig,
  ...config,
});