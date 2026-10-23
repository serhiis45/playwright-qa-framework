import { defineConfig } from "@playwright/test";
import { config } from "dotenv";

config();

export default defineConfig({
  testDir: "./tests/api",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "html",
  use: {
    actionTimeout: 30000,
    ignoreHTTPSErrors: true,
    video: "off",
    screenshot: "off",
    trace: "retain-on-failure",
  },
});
