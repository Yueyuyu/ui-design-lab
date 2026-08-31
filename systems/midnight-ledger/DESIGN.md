---
version: 0.1.0
name: Midnight Ledger
description: "深夜交易终端式的高密度数据产品设计系统。"
colors:
  canvas: "#1C223A"
  panel: "#252A40"
  ledger: "#E8D8B3"
  primary: "#EF5B32"
  positive: "#9DCE8E"
  negative: "#E57763"
---

## Overview

Midnight Ledger 将深蓝账盘、奶油色资产摘要、高密度数据区域和克制涨跌颜色组合成可长时间使用的金融终端。TradeGenius 主母版负责总览型页面，紧凑母版补充表格、计划、建议与高频操作；CluesAI 驾驶舱补充固定侧栏、情绪指标、趋势矩阵、机会卡和跟踪表格。

## Colors

深蓝画布与略亮面板建立层级；奶油色既是主文字，也是资产摘要的反转表面。橙色仅用于主要交易操作，绿色和珊瑚红只表达方向或结果，不能代表按钮层级。

## Typography

优先使用 Inter，中文回退至 Segoe UI Variable、Segoe UI、Microsoft YaHei UI。金额和关键收益采用粗体比例数字；ID、价格和时间可使用 Cascadia Mono。正文默认 14px，辅助文字不低于 11px。

## Layout

使用 4px 基准网格、12–16px 面板内边距和 8–12px 区域间距。桌面优先采用不等宽仪表盘网格；平板转为两列；手机转为单列并保证资产与主要操作先出现。

## Elevation & Depth

依靠色阶与 1px 边线区分面板。阴影仅用于对话框和临时浮层，不使用玻璃模糊、霓虹光晕或渐变背景。

## Shapes

输入与按钮使用 6–10px 圆角，主面板使用 16px 圆角，语义标签使用胶囊。奶油资产面板的大圆角是套系签名，但不能复制到每个组件。

## Components

组件覆盖按钮、图标按钮、输入、选择器、开关、面板、状态标签、表格、对话框、通知、空状态、折线图、指标和终端预览。所有组件遵循 default、hover、pressed、focus、disabled、loading、error 七态。

## Do's and Don'ts

### Do

- 用连续表格和紧凑列表承载重复数据。
- 让奶油色资产面板成为少量高优先级反转表面。
- 用绿色与红色同时提供符号和文字，不只依赖颜色。
- 在小屏按任务优先级重排，而不是等比缩小。

### Don't

- 不把每个指标都做成独立卡片。
- 不使用赛博霓虹、渐变、玻璃拟态或大面积纯黑。
- 不把橙色同时当作品牌、警告和负收益颜色。
- 不从 Quiet Workspace 引入 Token、组件或资产。

## Responsive Behavior

桌面 3–4 轨道；平板 2 轨道；手机 1 轨道。表格在窄屏提供横向滚动并保留首列。图表保持最小 240px 高度，关键数据摘要始终位于首屏。

## Agent Usage

当用户要求使用 `midnight-ledger` 时，先读 `suite.json`、本文件、`foundations/`、`standards/` 与 `web/index.js`。必须使用 `[data-ui-system="midnight-ledger"]`、`--ml-*` 和 `Ledger*` 组件；不得混入其他套系。完成后运行 `npm run suite:check`。
