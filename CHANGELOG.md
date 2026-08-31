# 变更记录

本文件记录 UI Design Lab 的公开版本变化。版本遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)，内容格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [Unreleased]

## [1.0.0] - 2026-08-31

### 新增

- 增加 `#/compare` 同场景对比模式，在独立作用域中并排渲染 Quiet Workspace 与 Midnight Ledger。
- 增加根包、两个套系组件和 CSS 的稳定 `exports` 子路径。
- 增加兼容性合同、发布检查和三份现场/截图视觉来源的设计 QA 边界。

### 变更

- 项目版本与单套系版本正式解耦；Suite ID、作用域、Token 前缀和导出路径成为 v1 公共合同。

## [0.6.0] - 2026-08-31

### 新增

- 发布第二套视觉系统 Midnight Ledger / 午夜账盘，稳定 ID 为 `midnight-ledger`。
- 从两张 TradeGenius 截图和 CluesAI Cockpit 现场页面拆解深色金融终端 Token、14 个七态组件与 3 种页面模式。
- 增加总览、基础规范、组件、内容行为、页面模式、Playground 和使用指南 7 个页面。

### 变更

- Gallery 从单套系验证升级为两套系切换、隔离和响应式预览。

## [0.5.0] - 2026-08-31

### 新增

- 增加全套系清单校验、套系列表、套系脚手架和 `DESIGN.md` 草案生成命令。
- 为 Quiet Workspace 增加符合 Agent 读取习惯的 `DESIGN.md`、Playground 和使用指南。
- 增加视口预览、标准场景、Codex 指令复制和套系能力清单。

### 变更

- 将验证流程从单套系硬编码升级为遍历 `systems/*/suite.json` 的注册式验证。
- Quiet Workspace 展示模块迁移到自己的 `systems/quiet-workspace/showcase/` 边界。

## [0.4.0] - 2026-08-31

### 新增

- 建立 `suite.json` 套系合同和 JSON Schema。
- 建立自动套系注册表、套系目录页和 `#/systems/<suite-id>/<page>` 稳定路由。
- 增加套系选择器、成熟度、平台、模式、密度、标签和视觉母版入口。

### 变更

- Gallery 外壳不再直接导入 Quiet Workspace 样式和页面。
- 设计套系通过懒加载 Showcase 模块接入 Gallery。

## [0.3.0] - 2026-08-20

### 新增

- 建立“单仓库、多套系、强隔离”的 UI Design Lab 结构。
- 发布首套视觉系统 Quiet Workspace / 静谧工作台。
- 提供暖白纸张、鼠尾草绿、字体、间距、圆角、阴影和语义状态 Token。
- 提供舒适与紧凑双密度，以及组件七态契约。
- 补齐按钮、输入框、下拉框、对话框、表格、通知、空状态、任务灯、额度胶囊和数据图表等组件。
- 建立可访问性、图标、数据图表、中文文案、动效和状态语义规范。
- 建立 Gallery 展示与 Sites 构建、验证流程。

[Unreleased]: https://github.com/Yueyuyu/ui-design-lab/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Yueyuyu/ui-design-lab/compare/v0.6.0...v1.0.0
[0.6.0]: https://github.com/Yueyuyu/ui-design-lab/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/Yueyuyu/ui-design-lab/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/Yueyuyu/ui-design-lab/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Yueyuyu/ui-design-lab/releases/tag/v0.3.0
