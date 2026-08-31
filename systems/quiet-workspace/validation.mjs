import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

function relativeLuminance(hex) {
  const channels = hex
    .match(/[a-f\d]{2}/gi)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
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

export async function validateSuite({ root, suiteDir, tokens, interactionStates }) {
  const componentCss = await readFile(resolve(suiteDir, "web/components.css"), "utf8");
  const quotaPill = await readFile(resolve(suiteDir, "web/QuotaPill.jsx"), "utf8");
  const taskLight = await readFile(resolve(suiteDir, "web/TaskLight.jsx"), "utf8");
  const galleryCss = await readFile(resolve(root, "src/styles.css"), "utf8");

  const requiredGroups = ["color", "fontSize", "lineHeight", "space", "radius", "duration", "easing", "density", "icon", "component"];
  const missingGroups = requiredGroups.filter((group) => !tokens[group]);
  if (missingGroups.length > 0) {
    throw new Error(`缺少 Token 分组：${missingGroups.join(", ")}`);
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
    ["quotaPill.neutralText", tokens.component.quotaPill.neutral.text.$value, tokens.component.quotaPill.neutral.surface.$value]
  ];
  const failingContrast = contrastPairs.filter(([, foreground, background]) => contrastRatio(foreground, background) < 4.5);
  if (failingContrast.length > 0) {
    throw new Error(`正文色对比度低于 4.5:1：${failingContrast.map(([name]) => name).join(", ")}`);
  }

  const expectedComponents = ["button", "iconButton", "statusChip", "input", "select", "dialog", "table", "notification", "emptyState", "toggle", "card", "chart", "taskLight", "quotaPill"];
  const missingComponents = expectedComponents.filter((component) => !interactionStates.components[component]);
  if (missingComponents.length > 0) {
    throw new Error(`状态契约缺少组件：${missingComponents.join(", ")}`);
  }

  const smallFontDeclarations = [
    ...findSmallFontDeclarations(componentCss, "components.css"),
    ...findSmallFontDeclarations(galleryCss, "src/styles.css")
  ];
  if (smallFontDeclarations.length > 0) {
    throw new Error(`发现低于 11px 的文字：${smallFontDeclarations.join(", ")}`);
  }

  if (!taskLight.includes('data-density="compact"')) {
    throw new Error("桌面任务灯必须固定使用紧凑密度。");
  }
  if (!quotaPill.includes('data-density="compact"')) {
    throw new Error("周额度胶囊必须固定使用紧凑密度。");
  }
  if (quotaPill.includes("qw-signal") || quotaPill.includes("status-chip")) {
    throw new Error("周额度胶囊不得复用任务状态点或普通状态徽标。");
  }
  if (!componentCss.includes("font-weight: 400") || !componentCss.includes("--qw-quota-healthy-text")) {
    throw new Error("周额度胶囊缺少同色系常规字重契约。");
  }

  return `${contrastPairs.length} 组对比度达标，${expectedComponents.length} 个组件覆盖完整状态`;
}
