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

优先复用 ${manifest.components} 的真实导出。现有组件不是设计范围的上限；缺少时可按本套规则在业务项目中新增，不编造库 API。

## Do's and Don'ts

- 使用 ${manifest.scope} 和 --${manifest.prefix}-* Token。
- 不得混入其他套系。

## Agent Usage

先读 suite.json、本文、Token 与相关标准，理解设计原则后再读 API、类型及相近组件源码。根据用户任务选择布局，不机械继承示例外壳。

正式交付前需根据本套来源补充 standards/extension.md，并登记到 manifest.capabilities.standards：说明设计不变量、布局取舍、新组件推导实例与验收；不能仅用本生成草案替代设计规则。

消费项目运行自己的构建与相关交互检查；只有修改实验室源码时运行 npm run suite:check。
`;

if (outArg) {
  const outPath = resolve(root, outArg.slice("--out=".length));
  await writeFile(outPath, output, { encoding: "utf8", flag: "wx" });
  console.log(`已生成 ${outPath}`);
} else {
  process.stdout.write(output);
}
