---
version: alpha
name: Pulse Desktop
description: "Pulse 原版视觉的 Windows 适配验证套件"
colors:
  canvas: "#151515"
  ink: "#FFFFFF"
  primary: "#00E68C"
---
## Overview

0.1.0 / draft。2026-09-21 用户确认直接沿用 Pulse 现成设计，停止先前自绘白色“小搭子”。独立只指目录、Token 和发布边界；不覆盖 Quiet Workspace。最新授权在本机迁移 Companion 为 Pulse 后台入口，旧版与启动项备份可回退，不代表公开发布。

## Colors

PanelSurface 原版纯黑；UsageTint 原值：绿 rgb(0, .90, .55)、黄 rgb(1, .76, .15)、红 rgb(1, .31, .26)、用尽 rgb(.85, .09, .13)。按已用比例 <50%、<75%、≥75%、100% 分层；界面选择原版支持的“剩余”读法。机器人机身用 BotMarkTint 的 10 色等亮度色轮；单 Codex 为第 0 色，不强行改成绿色。未知不显示健康环。

## Typography

上游为系统 rounded 字体；Windows 技术适配用 Segoe UI Variable / Segoe UI / Microsoft YaHei UI。环下百分比 13px 等宽数字，详情标题 14px；中文辅助内容保留最低 12px 可读性。未分发 Apple 字体。

## Layout

原版 DockLayout：侧轨 64px，环中心线直径 36px、线宽 4px，中心机器人 28px；环下间隔 6px、数字行高 16px。浮动单环侧轨 64×102px；贴边展开 64×150px；收起为 6×96px 细条，20px 命中宽度。详情 body 250px，pointer 20×40px，tip 与侧轨 8px，内边距 18px。

## Elevation & Depth

沿用纯黑实体，不添加自创阴影、毛玻璃或伪 Liquid Glass。壁纸仅在 Gallery 验证。透明 Windows 宿主承载同一份 SVG/CSS，不使用 WPF 重画机器人。

## Shapes

浮动为真胶囊。停靠为 DockBerthShape 的 n=4、48 段角曲线及 24×38px flare。详情尾部沿用 UsageBubbleShape 控制点；Windows 用同一 n=4 采样表达 continuous 圆角。body 与 pointer 在一个 SVG path 中填充，避免接缝。

## Components

PulseQuotaRing / PulseTaskRow / PulseDesktopDock。原版 OpenAI SVG 来自 Pulse 的 Lobe Icons；现成机器人使用 Pulse 同源 Web 引擎及原始几何。8 种人格、18 种造型由上游提供，不重新设计。Companion 的重点关注、任务行、固定与回调以原面板语言组合，非 Pulse 原生业务能力。

## Do's and Don'ts

悬停与点击均为临时展开，未固定时离开后按上游 320ms 宽限收起，移回取消；再次点击环、点击外部、窗口失焦或打开任务后收起。只有显式固定才常驻，贴边来源回到贴边。键盘焦点在面板内时不因鼠标静止在外而关闭；Escape 始终收起。低动态偏好、隐藏暂停及卸载清理必须可用。任务完成不移除关注；首次连接不庆祝历史完成。未知额度不作 0/100，环不是任务进度。

## Agent Usage

先读本目录 manifest、foundations、standards、UPSTREAM.md 与 web/index.js。运行 npm run suite:check。机器人授权未明确，仅本机使用；普通公开构建使用已标注来源的静态品牌图标，不包含机器人数据。Windows 宿主后台自启并使用真实只读业务，Lab 继续固定示例；每应用独立选择品牌图标或机器人，多个机器人按原版色轮分配，不另造配色。当前只有 Codex 真实接入，Cursor 是多项设计示例。

## 设计延伸

本套是一套可用于继续设计的视觉与交互语言，现有组件是可复用的起点。先读 [扩展规范](standards/extension.md)，根据任务选择布局，再决定直接复用、组合或在业务项目内新增组件。新增组件沿用本套 Token、字阶、间距、表面与交互规则，使用项目自己的名称和样式类；不能编造包导出，也不必复制示例页面的导航和业务字段。
