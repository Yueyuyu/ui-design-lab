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

export { sharedSceneData } from "./scene-data.js";
export { buildSuiteInstruction } from "./scene-context.js";

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

export const consistencyChecks = [
  { icon: CheckCircle, label: "数据、表单值与交互状态保持一致" },
];
