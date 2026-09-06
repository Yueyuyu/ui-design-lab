import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 60000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  outputDir: process.env.UI_LAB_TEST_OUTPUT || "test-results",
  use: { baseURL: "http://127.0.0.1:5173", trace: "retain-on-failure", screenshot: "only-on-failure", viewport: { width: 1440, height: 900 } },
  projects: [
    { name: "chromium", use: { browserName: "chromium", permissions: ["clipboard-read", "clipboard-write"] } },
    ...["firefox", "webkit"].map(browserName => ({ name: browserName, testMatch: /(?:compatibility|upload)\.spec\.mjs/, use: { browserName } })),
  ],
  webServer: [{ command: "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort", url: "http://127.0.0.1:5173", reuseExistingServer: !process.env.CI }, ...(process.env.UI_LAB_CONSUMER_DIR ? [{ command: `npm --prefix "${process.env.UI_LAB_CONSUMER_DIR}" run dev`, url: "http://127.0.0.1:5174", reuseExistingServer: !process.env.CI }] : [])],
});
