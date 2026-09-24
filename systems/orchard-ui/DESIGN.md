---
name: Orchard UI
id: orchard-ui
version: 0.1.0
status: experimental
---

## Overview

源于 Apple 的分组、主从导航与直接反馈，适合设置、资料与个人工具。 这是独立的 Web 组件实现，参考名称用于说明来源，不代表官方组件库。基础控件与特色组件都可单独导入。

## Visual source

参考采集于 2026-09-18，见 references/orchard-ui-source.png 与 docs/design-references/orchard-ui.md。基础数值为本项目对 Web 与中文的适配，不标作第三方官方 Token。画布中的示例文本由本项目原创。

## Layout and typography

分组保持标签、值与动作的直接对应，标题 28px、正文 14px、说明 12px。蓝色用于当前选择与主操作。现有设置页采用分类侧栏与白色内容组；资料库可用顶部工具栏，单一任务可用居中分组，不强制继承设置页外壳。

使用系统字体，Windows 与中文均有回退。舒适与紧凑密度调整控件高度及行距，不缩小正文。窄屏按布局需要折叠或重排导航，输入和操作仍完整可达；不声称原生移动应用或手势已实现。

## Components and behavior

套系总览展示真实图标与组件，首页以完整应用概念表现设计语言；概念图不代表其业务已经实现。完整偏好设置是现有页面组合。界面符号、应用图标、图标选择器、应用入口、命令菜单为独立组件。组件目录按自然高度连续排列，分类用于筛选；不为一个标签单独铺满一整行。

应用图像由 src 提供，业务选择与导航由 onChange/onLaunch/onSelect 接入。24 个语义符号与两个原创应用图像分开交付，不代表 Apple 官方软件图标。详细尺寸和语义见 standards/icons.md。

分组设置、设置行与导航列表是套系识别组件，设置工作台为页面组合。保存只在成功响应后更新已保存值，失败保留草稿；取消与卸载中止请求，拒绝迟到返回。

所有组件的七态见 foundations/interaction-states.json；不会直接交互的容器通过其内容或拥有的控件表达状态。模态使用 native dialog，菜单支持方向键、Escape 与焦点恢复。来源截图不随组件包分发。

## Agent Usage

先读取 suite.json、本文、foundations 与 standards，再读取 web/index.d.ts 和 API.md。只导入本套组件、样式与 Token，作用域为 `[data-ui-system="orchard-ui"]`。在本仓库运行 npm run suite:check；消费项目按包内 skills/consume-suite/SKILL.md 执行，不能要求消费项目包含实验室脚本。

## 设计延伸

本套是一套可用于继续设计的视觉与交互语言，现有组件是可复用的起点。先读 [扩展规范](standards/extension.md)，根据任务选择布局，再决定直接复用、组合或在业务项目内新增组件。新增组件沿用本套 Token、字阶、间距、表面与交互规则，使用项目自己的名称和样式类；不能编造包导出，也不必复制示例页面的导航和业务字段。
