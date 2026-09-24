---
name: Dialogue UI
id: dialogue-ui
version: 0.1.0
status: experimental
---

## Overview

源于 ChatGPT 的内容优先与轻量工具，适合对话、搜索、研究与写作。 这是独立的 Web 组件实现，参考名称用于说明来源，不代表官方组件库。基础控件与特色组件都可单独导入。

## Visual source

参考采集于 2026-09-18，见 references/dialogue-ui-source.png 与 docs/design-references/dialogue-ui.md。基础数值为本项目对 Web 与中文的适配，不标作第三方官方 Token。画布中的示例文本由本项目原创。

## Layout and typography

主区保留稳定阅读列宽，输入与正文轴线一致；欢迎标题 30px、正文 15px、说明 12px。现有对话页用侧栏管理会话，浅灰用户消息与纸面助手正文区分来源，大输入区承载连续输入。搜索、研究和写作可使用顶部入口、单列或对照画布；无需出现会话侧栏和消息气泡。主操作保持黑白与明确形状。

使用系统字体，Windows 与中文均有回退。舒适与紧凑密度调整控件高度及行距，不缩小正文。窄屏按布局需要折叠或重排导航，输入和操作仍完整可达；不声称原生移动应用或手势已实现。

## Components and behavior

消息、输入区、会话列表与话题建议是套系识别组件，对话工作台为页面组合。支持中文组合输入、Enter 发送、Shift+Enter 换行、停止、重试与切换。默认回复明确为本地演示，onSend 接入真实服务；目前返回整条正文，不提供流式解析或 Markdown 引擎。

所有组件的七态见 foundations/interaction-states.json；不会直接交互的容器通过其内容或拥有的控件表达状态。模态使用 native dialog，菜单支持方向键、Escape 与焦点恢复。来源截图不随组件包分发。

## Agent Usage

先读取 suite.json、本文、foundations 与 standards，再读取 web/index.d.ts 和 API.md。只导入本套组件、样式与 Token，作用域为 `[data-ui-system="dialogue-ui"]`。在本仓库运行 npm run suite:check；消费项目按包内 skills/consume-suite/SKILL.md 执行，不能要求消费项目包含实验室脚本。

## 设计延伸

本套是一套可用于继续设计的视觉与交互语言，现有组件是可复用的起点。先读 [扩展规范](standards/extension.md)，根据任务选择布局，再决定直接复用、组合或在业务项目内新增组件。新增组件沿用本套 Token、字阶、间距、表面与交互规则，使用项目自己的名称和样式类；不能编造包导出，也不必复制示例页面的导航和业务字段。
