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

内容优先，以衬线标题、图像、摘要与非等宽区域建立主次。阅读网站可用顶部导航与叙事序列，编辑任务可用正文和就近工具。现有主封面加两个侧向素材是内容画布示例，不是每个页面的固定布局。

## Colors

见 foundations/tokens.json，语义 Token 为真值。

## Components

button、field、select、toggle、panel、badge、bar-chart、shell、data-table、textarea、checkbox、radio-group、combobox、multi-select、date-picker、date-range、tabs、breadcrumb、pagination、dropdown-menu、tooltip、popover、drawer、progress、skeleton、toast-queue。

## Agent Usage

先读本文、standards/extension.md、Token 与相关标准，再读 API.md、web/index.d.ts 和相近源码。复用真实 Signal* 导出，使用 [data-ui-system="signal-studio"] 作用域；缺少的组件在业务项目内沿本套语言新增。禁止跨套系导入与猜测接口。

## Composition Rules

- 导航与区域大小根据内容关系确定。现有内容工作台用横向导航与主封面加侧向内容的非等宽画布；其他页面可以重新组织。衬线标题服务于内容层级，不用于所有表单标签。
- 内容卡片是阅读和编辑的入口，列表是同一批内容的另一视图，不复制数据。窄屏按主内容、次内容、修订顺序单列。
- 编辑抽屉容纳标题、说明与内容状态；保存成功后才关闭并记录修订，失败保留草稿。取消不产生修订。
- 封面、标题、说明和作者共同表达内容；不把创作间改成后台表格，只换紫色。

## Reuse & Boundaries

SignalStoryCard 和 SignalRevisionList 是业务组件，SignalContentBoard 是页面组合，不计入组件数。内容编辑场景为 #/systems/signal-studio/patterns/flows?kit=content。

受控 stories、异步保存与取消约定见 INTEGRATION.md。修订仅包含本次会话成功保存的快照；没有远程版本恢复、正式发布和上传。素材页展示当前内容的封面，不声称完整素材库。

## Do's and Don'ts

- 推荐：用内容优先级决定画布面积，保留标题、说明与图片之间的关联。
- 避免：所有内容等面积卡片化、拿更新日期冒充版本库、保存失败后关掉抽屉。
- 目录树或上传只在实际素材任务需要时扩展，不因其他套系有此组件就复制。

## 阅读层级与密度补充

画布主标题 30–48px，次内容标题 22–34px；正文 14px。主封面显示真实内容标题，不能只依赖图片中的字。紧凑模式收紧导航、内容留白和控件高度，保留衬线层级。

## 设计延伸

本套是一套可用于继续设计的视觉与交互语言，现有组件是可复用的起点。先读 [扩展规范](standards/extension.md)，根据任务选择布局，再决定直接复用、组合或在业务项目内新增组件。新增组件沿用本套 Token、字阶、间距、表面与交互规则，使用项目自己的名称和样式类；不能编造包导出，也不必复制示例页面的导航和业务字段。
