---
version: 0.1.0
name: Clearline Console
status: experimental
description: 清爽、对齐严谨的企业后台，专注项目、表格、权限与设置。
---

## Overview

清爽、对齐严谨的企业后台，专注项目、表格、权限与设置。

用户授权代理自主选稿。视觉来源：references/clearline-console-source.png。此名称是本项目套系显示名，未做商标注册承诺。

## Typography

正文 "Segoe UI", "Microsoft YaHei UI", sans-serif，14px 起；标题 "Segoe UI", "Microsoft YaHei UI", sans-serif。辅助文字至少12px。

## Layout

200px 浅灰侧栏；白色主面、表格行分隔、右侧详情。

## Colors

见 foundations/tokens.json，语义 Token 为真值。

## Components

button、field、select、toggle、panel、badge、bar-chart、shell、data-table、textarea、checkbox、radio-group、combobox、multi-select、date-picker、date-range、tabs、breadcrumb、pagination、dropdown-menu、tooltip、popover、drawer、progress、skeleton、toast-queue。

## Agent Usage

只从本套系入口导入 Clear* 组件，使用 [data-ui-system="clearline-console"] 作用域。阅读 API.md 和 web/index.d.ts，禁止跨套系导入与猜测接口。
