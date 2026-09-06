import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { validateTokenBindings, validateSourceIsolation, resolveWithin } from "../scripts/lib/suite-integrity.mjs";

const tokens = { color: { paper: { $value: "#FFFFFF" } } };
const bindings = { base: { "--aa-paper": "color.paper" } };
test("双向 Token 校验拒绝值漂移、缺失映射及缺失 CSS", () => {
  validateTokenBindings(tokens, '[data-ui-system="alpha"] { --aa-paper: #ffffff; }', bindings);
  assert.throws(() => validateTokenBindings(tokens, "[data-ui-system] { --aa-paper: #000000; }", bindings), /不一致/);
  assert.throws(() => validateTokenBindings(tokens, "[data-ui-system] { --aa-other: #ffffff; }", bindings), /未绑定/);
  assert.throws(() => validateTokenBindings(tokens, "", bindings), /缺少 CSS/);
  assert.throws(() => validateTokenBindings({ ...tokens, space: { gap: { $value: "4px" } } }, "[data-ui-system] { --aa-paper: #ffffff; }", bindings), /未导出/);
});
test("隔离校验拒绝静态、动态、再导出和 CSS 跨套系引用", () => {
  const manifests = [{ id: "alpha", prefix: "aa" }, { id: "beta", prefix: "bb" }];
  const dir = resolve("systems/alpha");
  const check = (source, ext = "jsx") => validateSourceIsolation(source, resolve(dir, "web/Example." + ext), dir, manifests);
  check('import { Button } from "./Button.jsx";');
  for (const source of [
    'import { Button } from "../../beta/web/index.js";',
    'export * from "../../beta/web/index.js";',
    'const load = () => import("../../beta/web/index.js");',
    'const style = {color: "var(--bb-ink)"};',
  ]) assert.throws(() => check(source), /跨套系/);
  assert.throws(() => check('[data-ui-system="alpha"] .aa-button { color: var(--bb-ink); }', "css"), /跨套系/);
  assert.throws(() => check('.aa-button { color: red; }', "css"), /缺少套系作用域/);
});
test("manifest 文件路径必须留在套系目录", () => {
  assert.equal(resolveWithin(resolve("systems/alpha"), "./web/index.js"), resolve("systems/alpha/web/index.js"));
  assert.throws(() => resolveWithin(resolve("systems/alpha"), "../beta/web/index.js"), /越出/);
});
