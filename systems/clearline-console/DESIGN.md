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

白色工作面、严谨对齐与轻行分隔构成基本语言。记录处理可用全宽表格和就近详情，单据填写可用分组表单；导航按任务选择。现有项目工作台采用 200px 浅灰侧栏与右侧详情，这是页面组合示例。

## Colors

见 foundations/tokens.json，语义 Token 为真值。

## Components

button、field、select、toggle、panel、badge、bar-chart、shell、data-table、textarea、checkbox、radio-group、combobox、multi-select、date-picker、date-range、tabs、breadcrumb、pagination、dropdown-menu、tooltip、popover、drawer、progress、skeleton、toast-queue。

## Agent Usage

先读本文、standards/extension.md、Token 与相关标准，再读 API.md、web/index.d.ts 和相近源码。复用真实 Clear* 导出，使用 [data-ui-system="clearline-console"] 作用域；缺少的组件在业务项目内沿本套语言新增。禁止跨套系导入与猜测接口。

## Composition Rules

以下规则描述现有项目工作台；其他任务的布局按扩展规范推导，数据与编辑一致性仍需保持。

- 目录是主任务面，右侧详情属于当前选中项；选中 ID 与记录集合单独持有，不复制两份记录。搜索、排序与分页先于打开详情。
- 项目名是主要入口，状态、负责人和更新时间为辅助列；不把每条记录改成同样的指标卡片。
- 桌面并排目录与详情，窄屏按目录、详情顺序单列；表格在自身容器滚动。新建用模态抽屉，修改已有状态在非模态详情中完成。
- 编辑先形成草稿，明确保存与取消。异步成功后才更新目录；失败保持原记录和草稿，不能用通知掩盖失败。

## Reuse & Boundaries

ClearProjectTable 与 ClearProjectDetails 是业务组件，ClearProjectWorkspace 是页面组合，不计入组件数。项目运营场景为 #/systems/clearline-console/patterns/flows?kit=projects；记录整理对比复用本套表格和表单，数据由比较层持有。

数据入口、回调和取消行为见 INTEGRATION.md。默认示例仅在内存；受控 rows 的持久化、权限与审计属于业务项目。readOnly 只是 UI 状态，不是安全权限校验。

## Do's and Don'ts

- 推荐：列表保持上下文，选中后就近处理属性；表格操作保持明确反馈。
- 避免：每次选中都跳离目录、关闭即自动保存、请求未成功就改变状态。
- 没有专属理由时保持常规表单行为，不为差异化改变用户熟悉的键盘操作。

## 阅读层级与密度补充

表格正文 14px、详情标题 18px；项目名可换行。选中行对应单个侧详，不展示批量勾选。舒适控件/行高为 40/48px，紧凑为 32/38px，导航、主区内边距同步收紧。关闭详情后目录占满可用宽度。

## 设计延伸

本套是一套可用于继续设计的视觉与交互语言，现有组件是可复用的起点。先读 [扩展规范](standards/extension.md)，根据任务选择布局，再决定直接复用、组合或在业务项目内新增组件。新增组件沿用本套 Token、字阶、间距、表面与交互规则，使用项目自己的名称和样式类；不能编造包导出，也不必复制示例页面的导航和业务字段。
