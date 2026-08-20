import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const tokenPath = resolve(root, "systems/quiet-workspace/foundations/tokens.json");
const cssPath = resolve(root, "systems/quiet-workspace/foundations/tokens.css");
const statePath = resolve(root, "systems/quiet-workspace/foundations/interaction-states.json");
const componentCssPath = resolve(root, "systems/quiet-workspace/web/components.css");
const quotaPillPath = resolve(root, "systems/quiet-workspace/web/QuotaPill.jsx");
const taskLightPath = resolve(root, "systems/quiet-workspace/web/TaskLight.jsx");
const galleryCssPath = resolve(root, "src/styles.css");
const tokens = JSON.parse(await readFile(tokenPath, "utf8"));
const css = await readFile(cssPath, "utf8");
const interactionStates = JSON.parse(await readFile(statePath, "utf8"));
const componentCss = await readFile(componentCssPath, "utf8");
const quotaPill = await readFile(quotaPillPath, "utf8");
const taskLight = await readFile(taskLightPath, "utf8");
const galleryCss = await readFile(galleryCssPath, "utf8");

const requiredGroups = ["color", "fontSize", "lineHeight", "space", "radius", "duration", "easing", "density", "icon", "component"];
const missingGroups = requiredGroups.filter((group) => !tokens[group]);
if (missingGroups.length > 0) {
  throw new Error(`Quiet Workspace 缺少 Token 分组：${missingGroups.join(", ")}`);
}

if (tokens.id !== "quiet-workspace" || tokens.prefix !== "qw") {
  throw new Error("Quiet Workspace 的套系 ID 或前缀不符合隔离约定。");
}

const customProperties = [...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]);
const invalidProperties = customProperties.filter((property) => !property.startsWith("--qw-"));
if (invalidProperties.length > 0) {
  throw new Error(`发现未隔离的 CSS Token：${invalidProperties.join(", ")}`);
}

if (!css.includes('[data-ui-system="quiet-workspace"]')) {
  throw new Error("Quiet Workspace CSS 缺少 data-ui-system 作用域。");
}

function relativeLuminance(hex) {
  const channels = hex
    .match(/[a-f\d]{2}/gi)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

const paper = tokens.color.surface.paper.$value;
const contrastPairs = [
  ["text.primary", tokens.color.text.primary.$value, paper],
  ["text.secondary", tokens.color.text.secondary.$value, paper],
  ["text.muted", tokens.color.text.muted.$value, paper],
  ["text.quiet", tokens.color.text.quiet.$value, paper],
  ["text.inverse", tokens.color.text.inverse.$value, tokens.color.brand.deep.$value],
  ["status.attentionText", tokens.color.status.attentionText.$value, tokens.color.status.attentionSoft.$value],
  ["status.runningText", tokens.color.status.runningText.$value, tokens.color.status.runningSoft.$value],
  ["status.successText", tokens.color.status.successText.$value, tokens.color.status.successSoft.$value],
  ["status.offlineText", tokens.color.status.offlineText.$value, tokens.color.status.offlineSoft.$value],
  ["quotaPill.healthyText", tokens.component.quotaPill.healthy.text.$value, tokens.component.quotaPill.healthy.surface.$value],
  ["quotaPill.cautionText", tokens.component.quotaPill.caution.text.$value, tokens.component.quotaPill.caution.surface.$value],
  ["quotaPill.criticalText", tokens.component.quotaPill.critical.text.$value, tokens.component.quotaPill.critical.surface.$value],
  ["quotaPill.neutralText", tokens.component.quotaPill.neutral.text.$value, tokens.component.quotaPill.neutral.surface.$value],
];
const failingContrast = contrastPairs.filter(([, foreground, background]) =>
  contrastRatio(foreground, background) < 4.5);
if (failingContrast.length > 0) {
  throw new Error(`正文色对比度低于 4.5:1：${failingContrast.map(([name]) => name).join(", ")}`);
}

const expectedComponents = [
  "button",
  "iconButton",
  "statusChip",
  "input",
  "select",
  "dialog",
  "table",
  "notification",
  "emptyState",
  "toggle",
  "card",
  "chart",
  "taskLight",
  "quotaPill",
];
const requiredStates = ["default", "hover", "pressed", "focus", "disabled", "loading", "error"];
const stateErrors = [];

if (JSON.stringify(interactionStates.requiredStates) !== JSON.stringify(requiredStates)) {
  stateErrors.push("requiredStates 顺序或内容不完整");
}

for (const component of expectedComponents) {
  const definition = interactionStates.components[component];
  if (!definition) {
    stateErrors.push(`${component} 缺少状态定义`);
    continue;
  }
  const missingStates = requiredStates.filter((state) => !definition[state]);
  if (missingStates.length > 0) {
    stateErrors.push(`${component} 缺少 ${missingStates.join(", ")}`);
  }
}

if (stateErrors.length > 0) {
  throw new Error(`组件状态契约不完整：${stateErrors.join("；")}`);
}

function findSmallFontDeclarations(source, sourceName) {
  const matches = [];
  const declarationPattern = /(?:font-size\s*:\s*|font\s*:[^;{}]*?)(\d+(?:\.\d+)?)px/gi;
  for (const match of source.matchAll(declarationPattern)) {
    const size = Number.parseFloat(match[1]);
    if (size < 11) {
      const line = source.slice(0, match.index).split("\n").length;
      matches.push(`${sourceName}:${line} (${size}px)`);
    }
  }
  return matches;
}

const smallFontDeclarations = [
  ...findSmallFontDeclarations(css, "tokens.css"),
  ...findSmallFontDeclarations(componentCss, "components.css"),
  ...findSmallFontDeclarations(galleryCss, "src/styles.css"),
];
if (smallFontDeclarations.length > 0) {
  throw new Error(`发现低于11px的文字：${smallFontDeclarations.join(", ")}`);
}

if (/gradient\s*\(/i.test(css) || JSON.stringify(tokens).toLowerCase().includes("gradient")) {
  throw new Error("核心 Token 中不应包含 Gallery 的深色渐变桌面背景。");
}

if (!taskLight.includes('data-density="compact"')) {
  throw new Error("桌面任务灯必须固定使用紧凑密度。 ");
}

if (!quotaPill.includes('data-density="compact"')) {
  throw new Error("周额度胶囊必须固定使用紧凑密度。 ");
}

if (quotaPill.includes("qw-signal") || quotaPill.includes("status-chip")) {
  throw new Error("周额度胶囊不得复用任务状态点或普通状态徽标。 ");
}

if (!componentCss.includes("font-weight: 400") || !componentCss.includes("--qw-quota-healthy-text")) {
  throw new Error("周额度胶囊缺少同色系常规字重契约。 ");
}

console.log(
  `Quiet Workspace 校验通过：${customProperties.length} 个 CSS Token，${contrastPairs.length} 组正文对比度达标，${expectedComponents.length} 个组件覆盖7种状态，文字不低于11px。`,
);
