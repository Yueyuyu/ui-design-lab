import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

function luminance(hex) {
  const values = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function ratio(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export async function validateSuite({ suiteDir, tokens, interactionStates }) {
  const componentCss = await readFile(resolve(suiteDir, "web/components.css"), "utf8");
  const showcaseCss = await readFile(resolve(suiteDir, "showcase/showcase.css"), "utf8");
  const requiredGroups = ["color", "fontSize", "lineHeight", "space", "radius", "duration", "easing", "density", "icon"];
  const missingGroups = requiredGroups.filter((group) => !tokens[group]);
  if (missingGroups.length) throw new Error(`缺少 Token 分组：${missingGroups.join(", ")}`);

  const panel = tokens.color.surface.panel.$value;
  const canvas = tokens.color.surface.canvas.$value;
  const ledger = tokens.color.surface.ledger.$value;
  const pairs = [
    ["primary/panel", tokens.color.text.primary.$value, panel],
    ["secondary/panel", tokens.color.text.secondary.$value, panel],
    ["muted/panel", tokens.color.text.muted.$value, panel],
    ["quiet/canvas", tokens.color.text.quiet.$value, canvas],
    ["onLedger/ledger", tokens.color.text.onLedger.$value, ledger],
    ["positive/panel", tokens.color.status.positive.$value, panel],
    ["negative/panel", tokens.color.status.negative.$value, panel],
    ["warning/panel", tokens.color.status.warning.$value, panel],
    ["info/panel", tokens.color.status.info.$value, panel]
  ];
  const failures = pairs.filter(([, foreground, background]) => ratio(foreground, background) < 4.5);
  if (failures.length) throw new Error(`对比度低于 4.5:1：${failures.map(([name]) => name).join(", ")}`);

  const expected = ["button", "iconButton", "statusBadge", "input", "select", "toggle", "panel", "dialog", "table", "notification", "emptyState", "lineChart", "metric", "terminalPreview"];
  const missing = expected.filter((component) => !interactionStates.components[component]);
  if (missing.length) throw new Error(`状态契约缺少组件：${missing.join(", ")}`);

  for (const [name, source] of [["components.css", componentCss], ["showcase.css", showcaseCss]]) {
    for (const match of source.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi)) {
      if (Number(match[1]) < 11) throw new Error(`${name} 存在低于 11px 的文字：${match[1]}px`);
    }
  }
  if (!componentCss.includes('[data-ui-system="midnight-ledger"]')) throw new Error("组件 CSS 缺少套系作用域");
  return `${pairs.length} 组对比度达标，${expected.length} 个组件覆盖完整状态`;
}
