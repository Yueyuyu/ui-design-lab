---
version: "0.1.0"
name: Folio Workspace
description: "内容优先的页面、块与数据库工作台"
colors:
  canvas: "#ffffff"
  ink: "#30302e"
  primary: "#30302e"
---

## Overview

Folio Workspace / 页集工作台是参考 Notion 产品界面的独立实验套系。视觉锚点是 references/folio-workspace-source.png 中官方块布局示例：正文、折叠、表格、看板在一张纸面上共存。实现采用原创示例与 Token，不使用 Notion 品牌素材，亦不声称是官方复刻。

## Colors

白纸 #ffffff、侧栏 #f7f7f5、正文 #30302e、辅助 #6b6b65、轻线 #e9e9e5。品牌色克制，状态靠文字与浅色小标签表达。精确定义以 foundations/tokens.json 与 CSS 双向绑定为准。

## Typography

Segoe UI Variable / Segoe UI / Microsoft YaHei UI 系统字体。正文 14px，标题 32px，块标题 19px，辅助最小 11px。正文宽度优先控制在 760px 左右，数据库可扩展。尺寸是本项目取舍，并非 Notion 官方 Token。

## Layout

开放纸面为主，正文不套卡片，内嵌数据库使用轻行列分隔。有层级内容时使用页面树，浅层阅读入口可用顶部索引。现有工作区以 200px 页面树、薄面包屑与纸面组合；非模态侧详保留列表操作，窄屏排在内容后，目录通过按钮展开。该组合不限定所有新页面。

## Elevation & Depth

只有块菜单浮层有微弱投影。页面、表格与导航不使用大阴影，层级来自间距、字重和分隔。

## Shapes

4px 小圆角用于控件与浅提示，标签 3px。禁止把页面改成大圆角指标卡片网格。

## Components

11 个公开组件：FolioButton、FolioStatus、FolioCallout、FolioPageHeader、FolioPageTree、FolioBreadcrumbs、FolioBlockEditor、FolioViewTabs、FolioDatabase、FolioRecordDetail、FolioWorkspace。七态合同见 foundations/interaction-states.json，API 与 TypeScript 见 API.md 和 web/index.d.ts。

## Do's and Don'ts

- 按任务使用内容块、轻量记录与同一集合多视图建立识别；只有层级内容需要页面树，不只改颜色。
- 视图配置独立，记录共享；侧开详情保留草稿，取消只丢弃当前草稿。
- 纯文本块采用 textarea，支持中文组合输入；不以 contentEditable 假装成熟富文本引擎。
- 使用上移/下移替代本版尚未实现的拖拽；未实现关系、公式、日历、上传、评论、权限与云协作。
- 所有内容只保存在当前浏览器。相同 storageKey 不提供多标签并发合并，消费项目需要自己的持久化/同步方案。

## Agent Usage

先读 suite.json、本文、standards/extension.md、foundations 与相关标准，再读 API.md 和 web/index.d.ts。包内组件通过 ui-design-lab/folio-workspace 导入；新增组件从业务项目自身目录导入，位于 [data-ui-system="folio-workspace"] 内并引用 --fw- Token。工作区 storageKey 固定于挂载生命周期，切换键时使用 React key 重建。Gallery 工具可共享，套系不得引用其他套系代码或 Token。消费项目运行自身构建与交互检查；修改实验室时运行 npm run suite:check、构建及相关 Folio 浏览器测试。比较支持记录整理：使用本套数据库与非模态详情，与 Clearline 共用记录、草稿和视图筛选快照。经营图表场景仍明确不支持，不为对齐而添加假图表。

## 阅读层级与密度补充

页面头、提示和正文块受阅读宽度约束，数据库独立分节。按工作区容器宽度将非模态侧详转成下方单列，保持正在编辑的记录；没有新增密度模式。

## 设计延伸

本套是一套可用于继续设计的视觉与交互语言，现有组件是可复用的起点。先读 [扩展规范](standards/extension.md)，根据任务选择布局，再决定直接复用、组合或在业务项目内新增组件。新增组件沿用本套 Token、字阶、间距、表面与交互规则，使用项目自己的名称和样式类；不能编造包导出，也不必复制示例页面的导航和业务字段。
