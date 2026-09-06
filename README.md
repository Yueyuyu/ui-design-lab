# UI Design Lab

[![Release](https://img.shields.io/github/v/release/Yueyuyu/ui-design-lab?display_name=tag&sort=semver)](https://github.com/Yueyuyu/ui-design-lab/releases/latest)

一个“单仓库、多套系、强隔离”的 UI 设计系统实验室。每套视觉系统拥有独立的 Token、组件、模式、规范、资产和版本边界；只有 Gallery 与构建工具可以共享。

当前源码版本为 `v1.0.0-beta.1`，已推送至本仓库；这是可送测的候选，不代表已经创建 Git Tag 或 GitHub Release。此前记录的公开版本为 [`v0.3.0`](https://github.com/Yueyuyu/ui-design-lab/releases/tag/v0.3.0)。

Beta 接入：收到 Starter 后解压，运行 `npm install` 和 `npm run dev`；组件包随 vendor/ 交付。源码生成方式见 [快速开始](QUICKSTART.md)。[版本说明](docs/BETA-NOTES.md) · [20 分钟试用任务](docs/BETA-TRIAL.md)。

## 2026-09-05 扩展（9 月 6 日推送源码）

现有四套：Quiet Workspace（研究效率）、Midnight Ledger（运营分析）、Clearline Console（企业后台）、Signal Studio（内容创作）。新增两套为 experimental；它们是独立视觉语言，均接入注册、目录、比较、主题和本地分发。公开版本本轮未查询或变更。

- 首页：统一 800×400 真实组件封面、紧凑精选和全量搜索。
- 套系内：业务表格、表单、日期、菜单、提示、抽屉、通知与可保存主题。
- `#kits`：任务/研究/运营三个完整 UI 示例、新项目 Starter 和已有项目接入。
- [执行清单](ROADMAP.md) · [本轮验收](docs/ACCEPTANCE.md) · [商业边界](docs/COMMERCIAL.md) · [推广材料](docs/PROMOTION.md)。

## 仓库定位

这个仓库不是单个产品页面，也不是一组彼此混用的样式片段。它用于：

- 将一套经过确认的视觉语言沉淀为可复用的设计系统；
- 在 Gallery 中集中查看 Token、组件、状态、密度和页面模式；
- 让后续项目按明确边界复用，而不是每个项目重新决定颜色、字体、图标和动效；
- 允许未来新增完全不同的视觉套系，同时避免套系之间互相污染。

## 多套系 Gallery

Gallery 通过 `systems/*/suite.json` 自动发现设计套系，不在应用外壳中写死套系列表。每套设计拥有稳定的 Suite ID、独立 Token 前缀、CSS 作用域、组件入口、展示模块和 Agent 文档。

主要入口：

- `#/systems`：全部套系目录；
- `#/compare`：同一内容的跨套系对比；
- `#/systems/quiet-workspace/overview`：套系总览；
- `#/systems/quiet-workspace/components`：组件与七态矩阵；
- `#/systems/quiet-workspace/playground`：密度、视口和边界场景检查；
- `#/systems/quiet-workspace/usage`：组件导入与 Codex 指令。
- `#/systems/midnight-ledger/overview`：第二套系统总览与三份视觉来源；
- `#/systems/midnight-ledger/patterns`：资产总览、紧凑交易台和信号驾驶舱。

Suite、Theme 和 Density 是不同层级：完整视觉语言才创建新 Suite；明暗模式和舒适/紧凑密度属于现有 Suite 的变体。

## Suite 01 · Quiet Workspace / 静谧工作台

Quiet Workspace 是一套 light-first、Windows-friendly 的效率工具视觉系统，适合需要长时间阅读、监控和处理信息的桌面应用。它把温润编辑感、克制的工具属性与轻量桌面原生感结合在一起。

![Quiet Workspace 视觉母版](references/quiet-workspace-source.png)

### 视觉语言

| 维度 | 标准 |
|---|---|
| 风格 | 安静、温润、克制，以内容和排版建立层级，减少无意义卡片 |
| 表面 | 暖白纸张、纯白强表面和浅灰绿弱表面，不把深色桌面背景当成产品表面 |
| 主色 | 低饱和鼠尾草绿；提醒、执行中、成功和离线使用克制的语义色 |
| 字体 | `Segoe UI Variable`、`Segoe UI`、`Microsoft YaHei UI`、`system-ui`、`sans-serif` |
| 字号 | 辅助文字不低于 11px；控件标签和关键紧凑信息不低于 12px；正文默认 14px |
| 轮廓 | 细边线、柔和圆角与轻阴影；通过间距、边线和文字层级保持清楚 |
| 密度 | `comfortable` 用于常规工作台；`compact` 用于任务灯、监控列表和高频浮层 |
| 动效 | 140–180ms 的短促缓出反馈；不使用持续漂浮或无意义循环动画 |

准确色值、间距、圆角、字号和动效参数以 [tokens.json](systems/quiet-workspace/foundations/tokens.json) 与 [tokens.css](systems/quiet-workspace/foundations/tokens.css) 为准。

### 参考图片是做什么的

[`references/quiet-workspace-source.png`](references/quiet-workspace-source.png) 是 Quiet Workspace 的视觉母版，用于校准：

- 整体构图、内容密度和留白关系；
- 中英文字体、字号和信息层级；
- 面板、胶囊、任务灯的圆角、边线、阴影和状态语言；
- Gallery 中各页面是否仍然属于同一套视觉系统。

它不是需要逐像素复制的产品页面，也不是完整组件清单。图片中的深色渐变桌面只是展示场景，只能放在 Gallery；它不属于核心 UI Token，业务产品也不应自动继承该背景。

### 组件、状态与专项规范

当前已覆盖：

- Button、IconButton、Field、Select、Toggle；
- Card、Dialog、Table；
- Notification、EmptyState；
- StatusChip、BarChart、TaskLight、QuotaPill、WorkspacePreview。

每个可复用组件都必须定义 `default`、`hover`、`pressed`、`focus`、`disabled`、`loading` 和 `error` 七种状态。结构化状态契约位于 [interaction-states.json](systems/quiet-workspace/foundations/interaction-states.json)。

完整规范：

- [套系总说明](systems/quiet-workspace/README.md)
- [可访问性](systems/quiet-workspace/standards/accessibility.md)
- [组件状态](systems/quiet-workspace/standards/component-states.md)
- [图标](systems/quiet-workspace/standards/icons.md)
- [数据图表](systems/quiet-workspace/standards/data-visualization.md)
- [中文文案](systems/quiet-workspace/standards/chinese-copy.md)
- [动效](systems/quiet-workspace/standards/motion.md)
- [状态语义与额度胶囊](systems/quiet-workspace/standards/status-semantics.md)

## Suite 02 · Midnight Ledger / 午夜账盘

Midnight Ledger 是 dark-first、高密度的金融数据产品视觉系统。视觉来源包括两张 TradeGenius 截图与 [CluesAI 驾驶舱](https://theclues.pro/cockpit) 的现场页面；现场采样得到 `#1C223A` 画布、`#20263C` 侧栏、`#252A40` 面板、`#E5D4B6` 奶油文字、Inter 14px 和 12px 面板圆角。

它提供资产总览、紧凑交易控制台、信号驾驶舱、持仓表、日历热图、折线图、柱状图和 14 个七态组件。机器识别合同为：

- 套系 ID：`midnight-ledger`
- CSS 作用域：`[data-ui-system="midnight-ledger"]`
- Token 前缀：`--ml-`
- 组件前缀：`Ledger*` / `.ml-`

三份视觉来源分别保存在 `references/midnight-ledger-source.png`、`references/midnight-ledger-compact-source.png` 和 `references/midnight-ledger-live-source.png`。

## 复用边界

Quiet Workspace 的命名空间为：

- 套系 ID：`quiet-workspace`
- CSS 作用域：`[data-ui-system="quiet-workspace"]`
- Token 前缀：`--qw-`
- 组件类名前缀：`.qw-`

可复用代码放在 `systems/quiet-workspace/`；Gallery 位于 `src/`，只负责展示和组合。不同套系不得引用彼此的 Token、组件、模式或视觉资产。

## 本地运行

```powershell
git clone https://github.com/Yueyuyu/ui-design-lab.git
cd .\ui-design-lab
npm install
npm run dev
```

完整检查：

```powershell
npm run check
npm run test:sites
```

套系管理：

```powershell
npm run suite:list
npm run suite:check
npm run suite:design -- quiet-workspace
npm run suite:new -- midnight-console --name="Midnight Console" --zh="午夜控制台" --prefix=mc
```

新套系由脚手架以 `draft` 状态创建。视觉母版确认、组件七态补齐、Showcase 建立并通过校验后，才可升级为 `experimental` 或 `stable`。

## 新增视觉套系

1. 在 `systems/<suite-id>/` 建立独立目录。
2. 为 Token、类名和组件使用独立前缀。
3. 将全部 CSS 限定在独立的 `data-ui-system` 作用域内。
4. 不引用其他套系的 Token、组件、模式或视觉资产。
5. 在套系内提供 showcase/index.jsx；注册表自动发现，无需修改 Gallery 外壳。

## 版本规则

项目使用 [Semantic Versioning](https://semver.org/lang/zh-CN/)：

- `MAJOR`：套系契约或公共组件 API 出现不兼容变更；
- `MINOR`：向后兼容地新增 Token、组件、规范或 Gallery 能力；
- `PATCH`：向后兼容的问题修复、文档完善或视觉微调。

根目录 [`VERSION`](VERSION) 是人和自动化读取的项目版本，并与 `package.json`、`package-lock.json` 保持一致。单个套系拥有独立版本，记录该套系 Token、组件和视觉规范的变化。正式项目版本使用 `vX.Y.Z` Git Tag，并在 [GitHub Releases](https://github.com/Yueyuyu/ui-design-lab/releases) 中记录变化。

公共导出和稳定性合同见 [COMPATIBILITY.md](COMPATIBILITY.md)，发布验收顺序见 [RELEASE.md](RELEASE.md)。

历史变化见 [CHANGELOG.md](CHANGELOG.md)。

## 独立项目接入与质量保证

按 [QUICKSTART.md](QUICKSTART.md) 生成本地 tgz 并运行 [消费者示例](examples/consumer)。公共子路径提供 ESM、React peer dependencies 和 TypeScript 声明；当前保留 private，不代表已经发布 npm。参数与回调见 [Quiet API](systems/quiet-workspace/API.md) 和 [Ledger API](systems/midnight-ledger/API.md)。

首页提供成熟度、适用任务、能力边界和全部套系搜索。比较页按需加载套系自己的 comparison/index.jsx，单画布切换保留编辑状态，复制指令携带当前场景的 JSON 快照。母版缩略图仅作视觉参考。

`npm run check` 验证 JSON Schema、Token 双向绑定、套系源码隔离、脚手架扩展、场景导出、类型和构建。`npm run test:e2e` 验证目录、手机入口、模态生命周期和比较流程。`npm run test:consumer` 在仓库外安装、构建组件包。CI 配置见 [.github/workflows/quality.yml](.github/workflows/quality.yml)。

授权范围见 [LICENSE](LICENSE) 和 [NOTICE.md](NOTICE.md)；参考截图不在 MIT 再授权或组件包范围内。贡献与安全报告分别见 [CONTRIBUTING.md](CONTRIBUTING.md)、[SECURITY.md](SECURITY.md)。
