# 五套系信息架构与组件审查

日期：2026-09-06。范围：从套系总览寻找组件、查看详情、理解参数/状态、组合页面、试验与接入。基于本地页面、用户标注及当前源码；不构成真实后端或完整无障碍认证。

## 已确认的问题与处理

| 原问题 | 原因 | 本轮处理 |
| --- | --- | --- |
| 午夜账盘与静谧工作台出现 08/09/10 在 01 之前 | 各模块不断向导航前方追加栏目 | 文档层级统一为了解、构建、试用与接入，编号按实际顺序生成 |
| 澄明后台/信号创作间组件与业务组件打开相同拼盘，页面模式与完整场景重复 | 栏目和内容没有一对一责任 | 单一组件目录；页面组合与连续流程放在同一栏目；控件拼盘迁入交互试验 |
| 总览七块账盘区域无法单独导入 | 局部函数和数据硬编码在 TerminalPreview | 拆出七个参数化的 Ledger 业务组件；总览和封面复用实际导出 |
| 组件详情不完整，Folio 的导航/页面头等只在总览里看到 | 用控件拼盘代替逐组件文档 | 每个公开 UI 导出有稳定地址、用途、组成、实际预览、参数、七态、接入与源码 |
| Clear/Signal 的项目详情和内容卡片仅存在于整页 | 页面拥有全部 JSX | 抽出项目目录/项目详情、内容卡片/修订列表四个公开组件 |
| 组件数量包含页面预览，且与导出不一致 | manifest 与页面各自维护口径 | 组件和页面组合分开统计，docs:check 核对 manifest 与实际导出 |
| 基础规范仅展示部分手写 Token，存在文档漂移 | 展示内容脱离 canonical JSON | 五套基础页读取 tokens.json + token-bindings.json，支持类型筛选/搜索，保留套系布局与排版说明 |
| 持仓标 15 但只列 5 条；日期不按真实月历对齐；可点击行没有动作 | 静态原型伪装业务组件 | 计数来自 rows；日历正确计算首日/月长；动作回调提供反馈，无回调时静态显示 |
| 无效页静默落回总览，页面跳转不能正常返回 | 回退逻辑和 replaceState 滥用 | 未知页面/组件明确提示；导航写入历史；保留旧 URL 映射 |
| 规范正文的标题、段落和列表混排 | Markdown 展示仅按 LF 分块，未处理 Windows 换行 | 统一换行再分段；标题、列表和对照表正确呈现，手机表格在内部滚动 |
| 奶油色资产面板的标题过浅 | 面板标题仍使用深色面板的浅色文字 | 反转面板标题使用既有 text-on-ledger Token |

## 当前层级

1. **套系总览**：展示视觉特征与代表性页面，适合先判断是否合适。
2. **基础规范**：Token、字体、布局、间距、形状、模式和密度。
3. **组件目录**：基础组件完成单一动作/表达，业务组件完成局部任务。所有条目可独立打开。
4. **页面与流程**：整页构图、工作区框架和连续业务流程。来源布局参考保留其模拟边界。
5. **设计与行为规范**：图标、文案、动效、数据、无障碍、组合和服务边界。
6. **交互试验**：设置保存、失败恢复、控件联调与已有基础状态试验。
7. **主题编辑**：仅实际支持主题工具的套系显示。
8. **接入指南**：安装组件包、作用域和开发上下文。

## 组件数量

| 套系 | 基础 + 业务组件 | 页面组合导出 |
| --- | ---: | ---: |
| Quiet Workspace | 34 | 2 |
| Midnight Ledger | 39 | 2 |
| Clearline Console | 27 | 2 |
| Signal Studio | 27 | 2 |
| Folio Workspace | 10 | 1 |
| 合计 | 137 | 9 |

Folio 仍有 11 个公开 UI 导出，其中 FolioWorkspace 被正确归类为整页组合。没有为了增加套数或组件数复制同一实现。

## 新代码责任

- `src/gallery/docs/`：共享文档工具，负责搜索、目录、缩略缩放、详情和文档层级。
- `systems/<id>/showcase/index.jsx`：绑定本套组件、示例、Token、规范和既有业务流程。
- `systems/<id>/showcase/catalog.generated.json`：由实际公开导出、类型、七态和源码生成；禁止手改。
- `systems/midnight-ledger/web/business/`：七个账盘业务组件与套系内部的数据状态容器。
- `systems/clearline-console/web/ProjectComponents.jsx`、`systems/signal-studio/web/ContentComponents.jsx`：对应套系的局部业务组合。
- `scripts/component-docs.mjs`：`npm run docs:generate` 更新文档；`npm run suite:check` 同时检查文档、公开导出及数量漂移。

套系源码没有反向导入 Gallery，也没有导入其他套系 Token/组件。共享的是展示工具，不是业务组件实现。

## 兼容

- `#systems/...` 和 `#/systems/...` 均可访问。
- `components-plus` 旧链接进入组件目录；原控件联调迁至 `playground/controls`。
- `workflows` 旧链接进入 `patterns/flows`，保留 `?kit=` 场景参数。
- 原主题、设置、上传和业务流程继续保留，测试迁移入口而不删除业务断言。

## 验证证据

自动化覆盖见 `tests/browser/documentation.spec.mjs`、`compatibility.spec.mjs`、`implementation.spec.mjs`、`folio.spec.mjs`；新增公开接口见 `tests/types/business.tsx` 与仓库外消费验证。

| 验证 | 本轮最后有效结果 |
| --- | --- |
| `npm run check` | 通过：五套隔离、Schema、Token、文档一致性、组件包、类型、网站构建和 24/24 Node 测试（含 4 项 Sites 测试） |
| Chromium 文档、公共导航、弹窗和上传 | `documentation + gallery + upload` 19/19；逐个访问 146 个 UI 导出，覆盖 137 个组件与 9 个页面组合 |
| 后续空月历和规范排版修订 | 状态与手机用例 2/2；补上规范表格后手机用例再次 1/1，覆盖五套段落、列表、目录、详情、规范及页面入口 |
| 原业务流程与预览回归 | 广回归首轮 46/47；修复唯一的封面裁切后，封面结构与全导出/手机目录定向复验 7/7。未将首轮失败计作通过 |
| `npm run test:consumer` | 最终 tarball 在仓库外安装、类型检查和 Vite 构建通过；类型入口包含本轮 11 个新增组件 |
| 仓库外 Chromium | 2/2：四套连续任务、Folio 页面编辑/保存/刷新/视图切换 |
| 最终视觉与差异检查 | 五套目录、手机详情、资产标题对比度已查看；`git diff --check` 通过，四个 Sites 保护文件未修改 |

最终日志：`.local-cache/documentation-check-final.log`、`documentation-consumer-final.log`、`documentation-consumer-browser-final.log`、`documentation-states-final.log`、`documentation-guidelines-final.log`。最终独立消费目录为系统临时目录下的 `ui-design-lab-consumer-scJorz`；没有发布到 npm 或线上。

本地截图保存于 `.local-cache/docs-*-directory.png`、`.local-cache/docs-ledger-calendar-detail.png`、`.local-cache/docs-ledger-mobile.png`。目录截图用于确认层级和完整缩放；真实操作用例验证事件与状态。

## 明确边界

- 展示页不是交易服务、云协作、素材管理或权限后端；已在套系规范里逐项声明。
- 某些纯展示/页面组件没有独立 loading/error 参数，详情明确由所属流程处理，不能声称每个组件都支持同一组属性。
- 本轮落实信息架构、可复用边界和文档一致性；不将构建/截图结果等同于生产部署、支付或全量无障碍认证。
