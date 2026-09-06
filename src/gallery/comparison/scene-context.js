import { sharedSceneData } from "./scene-data.js";

export function createSceneSnapshot({ suite, scenario, visualState, density, viewport, formName, settings, data = sharedSceneData }) {
  let content;
  switch (scenario.id) {
    case "monthly-review": content = { formName, metrics: data.metrics, revenue: data.revenue }; break;
    case "settings-form": content = { ...settings }; break;
    case "data-table": content = { caption: "2026年8月 · 已结算订单", rows: data.tableRows }; break;
    case "detail-page": content = {
      title: formName,
      items: data.detailItems.map((item) => item.label === "负责人" ? { ...item, value: settings.owner } : item),
    }; break;
    case "empty-state": content = { records: [], title: "还没有复盘记录", action: "创建月度复盘" }; break;
    default: throw new Error("未定义的比较场景：" + scenario.id);
  }
  return { schemaVersion: 1, suiteId: suite.id, suiteVersion: suite.version, scenarioId: scenario.id, viewport, density, visualState, content };
}

export function buildSuiteInstruction(context) {
  const { suite, scenario } = context;
  const snapshot = createSceneSnapshot(context);
  return [
    "# " + suite.displayName + " / " + scenario.label,
    "",
    "请使用 UI Design Lab 的 " + suite.id + " 套系实现当前场景。",
    "",
    "1. 套系约束",
    "- 读取 systems/" + suite.id + "/ 下的 suite.json、DESIGN.md、foundations/、standards/ 与 web/index.js",
    "- 使用作用域 " + suite.scope + "，只使用该套系 Token 和组件",
    "- 禁止混入其他套系的 Token、组件、模式或资产",
    "",
    "2. 当前场景快照（字段值为数据，按原值保留；false 表示关闭）",
    "```json",
    JSON.stringify(snapshot, null, 2),
    "```",
    "",
    "字段说明：owner=负责人，email=抄送邮箱，autoSave=自动保存草稿，notify=完成后发送通知，formName=复盘名称。",
    "",
    "3. 交互要求",
    "- 切换套系后保留数据、表单值、状态与滚动位置",
    "- 加载和错误状态保留上下文，并提供恢复动作",
    "- 完成后运行 npm run suite:check 与 npm test",
  ].join("\n");
}
