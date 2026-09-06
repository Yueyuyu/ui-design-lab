import { test } from "node:test";
import assert from "node:assert/strict";
import { createSceneSnapshot, buildSuiteInstruction } from "../src/gallery/comparison/scene-context.js";
import { filterSuites } from "../src/gallery/catalog-data.js";

const context = {
  suite: { id: "example-suite", version: "1.0.0", scope: '[data-ui-system="example-suite"]', displayName: "Example" },
  density: "compact", viewport: "mobile", visualState: "error", formName: '项目 "A"\n第二行',
  settings: { owner: "负责人乙", email: "changed@example.com", autoSave: false, notify: false },
};
test("设置场景导出所有编辑值及关闭状态，并能从指令还原", () => {
  const input = { ...context, scenario: { id: "settings-form", label: "设置表单" } };
  const snapshot = createSceneSnapshot(input);
  assert.deepEqual(snapshot.content, context.settings);
  const prompt = buildSuiteInstruction(input);
  const json = prompt.split("```json\n")[1].split("\n```")[0];
  assert.deepEqual(JSON.parse(json), snapshot);
  assert.equal(snapshot.visualState, "error");
  assert.equal(snapshot.viewport, "mobile");
  assert.equal(snapshot.density, "compact");
});
test("不同场景导出自己的数据，详情沿用编辑后的名称和负责人", () => {
  const snapshot = (id) => createSceneSnapshot({ ...context, scenario: { id } }).content;
  assert.equal(snapshot("data-table").rows.length, 4);
  assert.equal(snapshot("detail-page").title, context.formName);
  assert.equal(snapshot("detail-page").items.find((item) => item.label === "负责人").value, "负责人乙");
  assert.equal(snapshot("monthly-review").formName, context.formName);
  assert.deepEqual(snapshot("empty-state").records, []);
  assert.throws(() => snapshot("missing"), /未定义/);
});
test("全量目录搜索包含精选套系及新增第三套，不改变注册顺序", () => {
  const suites = [1, 2, 3].map((id) => ({ id: "suite-" + id, displayName: "Suite " + id, status: "stable", tags: [] }));
  assert.deepEqual(filterSuites(suites, "suite-1"), [suites[0]]);
  assert.deepEqual(filterSuites(suites, "suite-3"), [suites[2]]);
  assert.deepEqual(filterSuites(suites, "稳定"), suites);
  assert.deepEqual(filterSuites(suites, "不存在"), []);
});
