---
version: 0.1.0
name: Signal Studio
status: experimental
description: 衬线标题与紫色内容画布，适合素材、编辑与品牌内容工作台。
---

## Overview

衬线标题与紫色内容画布，适合素材、编辑与品牌内容工作台。

用户授权代理自主选稿。视觉来源：references/signal-studio-source.png。此名称是本项目套系显示名，未做商标注册承诺。

## Typography

正文 "Segoe UI", "Microsoft YaHei UI", sans-serif，14px 起；标题 Georgia, "Microsoft YaHei UI", serif。辅助文字至少12px。

## Layout

横向品牌导航；大衬线标题；主内容封面与两个侧向素材构成编辑画布。

## Colors

见 foundations/tokens.json，语义 Token 为真值。

## Components

button、field、select、toggle、panel、badge、bar-chart、shell、data-table、textarea、checkbox、radio-group、combobox、multi-select、date-picker、date-range、tabs、breadcrumb、pagination、dropdown-menu、tooltip、popover、drawer、progress、skeleton、toast-queue。

## Agent Usage

只从本套系入口导入 Signal* 组件，使用 [data-ui-system="signal-studio"] 作用域。阅读 API.md 和 web/index.d.ts，禁止跨套系导入与猜测接口。
