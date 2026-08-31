import {
  ChartLineUp,
  CheckCircle,
  FileText,
  Gear,
  Table,
  Tray,
} from "@phosphor-icons/react";

export const comparisonScenarios = [
  {
    id: "monthly-review",
    label: "月度经营复盘",
    shortLabel: "月度复盘",
    eyebrow: "MONTHLY REVIEW",
    description: "收入、退款与客户趋势的月度复盘工作流。",
    icon: ChartLineUp,
  },
  {
    id: "data-table",
    label: "数据表格",
    shortLabel: "数据表格",
    eyebrow: "CUSTOMER LEDGER",
    description: "同一批客户数据的筛选、状态与行操作。",
    icon: Table,
  },
  {
    id: "settings-form",
    label: "设置表单",
    shortLabel: "设置表单",
    eyebrow: "REPORT SETTINGS",
    description: "保留相同字段值与开关状态的设置流程。",
    icon: Gear,
  },
  {
    id: "detail-page",
    label: "详情页",
    shortLabel: "详情页",
    eyebrow: "REVIEW DETAIL",
    description: "复盘详情、负责人和交付状态的阅读页面。",
    icon: FileText,
  },
  {
    id: "empty-state",
    label: "空状态",
    shortLabel: "空状态",
    eyebrow: "EMPTY STATE",
    description: "没有复盘记录时的说明与下一步操作。",
    icon: Tray,
  },
];

export const comparisonStates = [
  { id: "default", label: "默认" },
  { id: "loading", label: "加载" },
  { id: "error", label: "错误" },
];

export const comparisonModules = [
  { id: "metrics", label: "指标" },
  { id: "chart", label: "图表" },
  { id: "form", label: "表单" },
  { id: "buttons", label: "按钮状态" },
];

export const sharedSceneData = {
  metrics: [
    { id: "revenue", label: "本月收入", value: "¥284,600", delta: "+12.4%", direction: "up" },
    { id: "refund", label: "退款率", value: "1.8%", delta: "下降 0.3%", direction: "down" },
    { id: "customers", label: "活跃客户", value: "1,248", delta: "+86", direction: "up" },
  ],
  revenue: [
    { label: "3月", value: 32 },
    { label: "4月", value: 46 },
    { label: "5月", value: 39 },
    { label: "6月", value: 61 },
    { label: "7月", value: 54 },
    { label: "8月", value: 72 },
  ],
  tableRows: [
    { id: "C-1048", customer: "南风工作室", amount: "¥86,400", owner: "林简", status: "已确认" },
    { id: "C-1047", customer: "远山科技", amount: "¥72,800", owner: "周宁", status: "待复核" },
    { id: "C-1046", customer: "海岸零售", amount: "¥61,200", owner: "许安", status: "已确认" },
    { id: "C-1045", customer: "辰光教育", amount: "¥44,600", owner: "顾言", status: "需跟进" },
  ],
  detailItems: [
    { label: "复盘周期", value: "2026年8月" },
    { label: "负责人", value: "林简" },
    { label: "交付时间", value: "9月3日 18:00" },
    { label: "数据口径", value: "已结算订单" },
  ],
};

export function getScenarioById(id) {
  return comparisonScenarios.find((scenario) => scenario.id === id) ?? comparisonScenarios[0];
}

export function getStateLabel(id) {
  return comparisonStates.find((state) => state.id === id)?.label ?? id;
}

export function getSuiteFeatureLabels(suite, density = "comfortable") {
  const mode = suite.modes?.includes("dark") ? "深色优先" : "浅色优先";
  const densityLabel = density === "compact" ? "紧凑密度" : "舒适密度";
  const style = suite.tags?.includes("editorial")
    ? "编辑型工具"
    : suite.tags?.includes("financial")
      ? "金融数据工具"
      : suite.styleLabel;
  return [mode, densityLabel, style].filter(Boolean);
}

export function getSuiteMarkColor(suite) {
  const swatches = suite.swatches ?? [];
  const darkSwatch = swatches.find((color) => {
    const hex = color.replace("#", "");
    if (hex.length !== 6) return false;
    const [red, green, blue] = [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
    return (red * .2126 + green * .7152 + blue * .0722) < .42;
  });
  return darkSwatch ?? swatches[1] ?? swatches[0] ?? "#47524d";
}

export function buildSuiteInstruction({ suite, scenario, visualState, density, viewport, formName }) {
  const metricLines = sharedSceneData.metrics.map((item) => `- ${item.label}：${item.value}（${item.delta}）`).join("\n");
  const revenueLine = sharedSceneData.revenue.map((item) => `${item.label} ${item.value}万`).join("、");

  return `# ${suite.displayName} / ${scenario.label}

请使用 UI Design Lab 的 \`${suite.id}\` 套系实现“${scenario.label}”场景。

1. 套系约束
- 读取 \`systems/${suite.id}/suite.json\`、\`DESIGN.md\`、\`foundations/\`、\`standards/\` 与 \`web/index.js\`
- 使用作用域 \`${suite.scope}\`，只使用该套系 Token 和现有组件
- 禁止混入其他套系的 Token、组件、模式或资产

2. 当前上下文
- 视口：${viewport === "mobile" ? "移动端" : "桌面端"}
- 密度：${density === "compact" ? "紧凑" : "舒适"}
- 状态：${getStateLabel(visualState)}
- 复盘名称：${formName}

3. 固定数据（切换套系时保持不变）
${metricLines}
- 近六月收入：${revenueLine}

4. 交互要求
- 切换套系后保留数据、表单值、状态与滚动位置
- 加载和错误状态保持原组件尺寸
- 完成后运行 \`npm run suite:check\``;
}

export const consistencyChecks = [
  { icon: CheckCircle, label: "数据、表单值与交互状态保持一致" },
];
