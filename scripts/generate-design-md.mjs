import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const suiteId = args.find((arg) => !arg.startsWith("--"));
if (!suiteId) {
  throw new Error("用法：npm run suite:design -- <suite-id> [--out=path]");
}

const outArg = args.find((arg) => arg.startsWith("--out="));
const root = process.cwd();
const suiteDir = resolve(root, "systems", suiteId);
const manifest = JSON.parse(await readFile(resolve(suiteDir, "suite.json"), "utf8"));
const tokens = JSON.parse(await readFile(resolve(suiteDir, manifest.tokens.replace(/^\.\//, "")), "utf8"));

function colorEntries(group, prefix = []) {
  return Object.entries(group).flatMap(([key, value]) => {
    if (value?.$value) {
      return [[...prefix, key].join("-"), value.$value];
    }
    return colorEntries(value, [...prefix, key]);
  });
}

const colors = colorEntries(tokens.color)
  .map(([name, value]) => `  ${name}: "${value}"`)
  .join("\n");

const output = `---
version: alpha
name: ${manifest.displayName}
description: "${manifest.description}"
colors:
${colors}
---

## Overview

${manifest.displayName} / ${manifest.localizedName}。此文件由 suite.json 与 tokens.json 生成基础草案，设计原则与组件行为需要人工补充。

## Colors

颜色以 tokens.json 为规范来源。

## Typography

字体和排版以 foundations 中的 Token 与标准为准。

## Layout

布局规则需要根据套系视觉母版和目标平台补充。

## Elevation & Depth

层级规则需要根据套系视觉母版补充。

## Shapes

形状规则以 Token 为准。

## Components

优先复用 ${manifest.components} 导出的套系组件。

## Do's and Don'ts

- 使用 ${manifest.scope} 和 --${manifest.prefix}-* Token。
- 不得混入其他套系。

## Agent Usage

读取 suite.json、Token、标准和组件入口后再实现页面。完成后运行 npm run suite:check。
`;

if (outArg) {
  const outPath = resolve(root, outArg.slice("--out=".length));
  await writeFile(outPath, output, { encoding: "utf8", flag: "wx" });
  console.log(`已生成 ${outPath}`);
} else {
  process.stdout.write(output);
}
