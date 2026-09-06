import { test, expect } from "@playwright/test";
import { consumerFlow } from "./flows.mjs";

test("仓库外四套连续任务工作台", async ({ page }) => {
  test.skip(!process.env.UI_LAB_CONSUMER_DIR, "先运行 test:consumer，并将输出目录设置为 UI_LAB_CONSUMER_DIR");
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await consumerFlow({ p: page, goto: (url) => page.goto("http://127.0.0.1:5174" + url) });
  expect(errors).toEqual([]);
});
