# 2026-09-06 Beta 送测收尾

候选版本：1.0.0-beta.1。本次重新运行工程、浏览器与独立包验证；下方 9 月 5 日内容保留为历史记录。未创建本次候选的 GitHub Release、部署网站、发送试用邀请或开通收款。

## 2026-09-06 源码提交与推送

- `a9fe276`：开源许可、第三方素材与付费交付边界，已推送至 `origin/main`。
- `3ad9115`：四套 UI、组件分发、Beta Starter 与测试，已推送至 `origin/main`。
- 推送前再次运行 `npm run check`（含 21 项 Node 测试）及 `npm run test:sites`（4/4），均通过；四个 Sites 基础文件保持不变。
- `025a926`：持续集成与交付文档，已推送至 `origin/main`。首次远端验证发现 `check` 在构建之前执行 Sites 产物测试；本机已有构建产物掩盖了这一顺序问题。已将构建前置，保留原有测试断言；修复后的实际结果以 [GitHub Actions](https://github.com/Yueyuyu/ui-design-lab/actions/workflows/quality.yml) 的对应提交为准。

源码推送、远端验证、Release、npm 发布、网站部署和真实试用分别记录，不能相互替代。

修复顺序后，GitHub 的工程检查、Sites 与独立消费者验证通过；浏览器 63/65 通过，Chromium/WebKit 的 320px 比较页暴露套系下拉框容器的内在最小宽度问题。本机切换较宽字体也复现了 323px 页面宽度。已允许该容器收缩，并在原有 320px 回归中保留默认字体检查、追加较宽字体检查；不通过隐藏页面溢出或放宽断言处理。定位使用现有 Playwright（本会话未提供独立 Browser 插件/skill），修复后的远端结果仍以对应提交的 Actions 为准。

修复后本地 Chromium、Firefox、WebKit 的 320px 专项各 1/1 通过（首页、比较、四套工作流）；比较页默认/较宽字体均为 320px，套系选择与 A/B 切换正常，页面错误/警告与框架错误浮层均为空，并检查 1440px 桌面截图。首次本地重跑曾缺少 Firefox/WebKit 缓存路径，另有一次开发服务首次加载超时；使用已有 `.local-cache/browsers` 并待编译完成后，原断言通过，未安装新依赖或延长断言时限。

## 本次修复与交付

- A/B 切换到短页面时，页面总高度降低，浏览器将底部 scrollY 从 634 限制到 579。修复为在比较页外保留必要的滚动余量；没有拉齐套系组件高度，原滚动回归现已通过。
- Starter 从开发机器的绝对 tgz 路径改为随附 vendor/ 相对路径；缺少组件包时在创建文件前报错。已有目标目录仍拒绝覆盖。
- 网站接入步骤包含依赖安装、打包、生成、启动、修改字段和构建；安装文件名由 package.json 派生，接入下载包含实际套系的 JSX 示例。
- 发布候选生成脚本提供组件包、四套 Starter、静态 Gallery、版本说明、试用与服务模板以及 SHA-256 清单。

## 最后有效结果

| 检查 | 结果 | 证据范围 |
|---|---|---|
| `npm run release:prepare` | 通过 | 内含 `npm run check`：四套 Schema/隔离/Token、21 项 Node 测试、ESM、TypeScript、网站构建；随后 Sites 4/4 与候选打包 |
| Chromium 完整回归 | 41/41 通过，无跳过 | 包含最终独立消费者四套任务→重试→结果→用量；目录、比较、保存、菜单、主题、研究、报表与上传 |
| Firefox 153 补充回归 | 12/12 通过 | 四套设置/浮层键盘、320/390/720/859px、减少动态、接入下载、上传 |
| WebKit 26.5 补充回归 | 12/12 通过 | 与 Firefox 同范围；不等同 Safari 实机 |
| `npm run test:consumer` | 通过 | 仓库外安装、所有公开子路径类型检查、Vite 构建 |
| `npm run test:beta -- --dir=dist/releases/1.0.0-beta.1-volG8d` | 4/4 Starter 通过 | 20 个交付文件 SHA-256 校验；四套分别解压到系统临时目录、安装 vendor 相对依赖、修改任务名称、构建 |
| 内置浏览器 | 通过 | 实际加载 #kits、切换新建/已有项目和套系，桌面与 390px 截图、页面无横向溢出，错误/警告日志为空 |
| `git diff --check` | 通过 | 空白检查；四个 Sites 基础文件没有改动 |

消费者目录：`C:/Users/Yueyu/AppData/Local/Temp/ui-design-lab-consumer-twC3XS`。浏览器测试设置 UI_LAB_CONSUMER_DIR 指向该目录，未跳过消费者用例。

CLI 入口：`npm run test:e2e -- --project=chromium --workers=2` 和 `npm run test:compat -- --workers=2`。使用已安装的 Playwright；会话未列出独立 Browser 插件，因此采用项目测试入口，并用 CUA 内置浏览器补充可视检查。

失败追踪目录分别为系统临时目录 ui-lab-beta-chromium-final 与 ui-lab-beta-cross-final；最终均无失败。内置浏览器截图直接显示在本次任务中。历史错误没有混入当前通过结论。

## 上传与兼容性边界

- 三个引擎均覆盖：filechooser 事件选择测试文件、同文件再次选择、类型与 1 MB 大小上限、首次失败后重试、禁用时拒绝 drop、取消拒绝忽略 AbortSignal 的迟到结果、重试只完成一次、资料目录出现导入记录。
- 拖放为 DataTransfer 事件级自动化；没有把它记作从 Windows 资源管理器实际拖入文件。系统文件对话框手工操作和生产存储未验证。
- 720×450 是 1440×900 在 200% 缩放时的等效布局检查；未宣称系统 DPI 或真实浏览器缩放实测。
- 减少动态通过引擎媒体偏好模拟并检查比较画布过渡关闭。实体触屏、屏幕阅读器、Safari/macOS/iOS 和全站 WCAG 仍未验证。
- 下载引擎最初受网络沙箱 EACCES 阻止；经自动审批后从 Playwright 官方源成功下载。Firefox 受限执行时无法创建页面，正常桌面权限运行通过。独立消费者 esbuild 的临时目录读取同样在正常桌面权限下复验通过，未跳过检查或关闭安全机制。
- npm 缓存使用项目 .local-cache/npm；独立安装使用已准备缓存。没有新增应用依赖。

## 候选文件与真实验证

候选目录：`dist/releases/1.0.0-beta.1-volG8d/`。从 START-HERE.md 开始，release-manifest.json 与 SHA256SUMS.txt 对应实际交付文件。后续重新生成会获得另一个独立目录，不覆盖已经送测的文件。

四套可搬移 Starter 验证的独立目录分别为系统临时目录下 ui-lab-beta-clearline-console-yRCh0J、ui-lab-beta-midnight-ledger-dDV1Da、ui-lab-beta-quiet-workspace-Pjy1kH、ui-lab-beta-signal-studio-TZkVBg。测试将“季度客户洞察”改为对应的“Beta 字段验收 <suite-id>”再构建；原候选压缩包保持不变。完整路径见 .local-cache/beta-consumers.json。

真实试用、外部项目采用、订单、退款、留存、候选 Release、npm 发布与网站部署仍未发生。源码推送与远端 CI 见上方记录。试用任务与空白记录模板在 docs/BETA-TRIAL.md 和 docs/templates/；不把生成候选产物记作已上线或已获客。

---

# 2026-09-05 初步交付验收（历史记录）

本记录对应当前本地工作区，未提交、推送或部署。71 项主线均有实现或准备材料；M03、G04、V05 仍需真实订单、试用和发布证据。7 项远期候选仅完成方案与进入条件。

## 工程结果

| 验证 | 最后有效结果 | 范围 |
|---|---|---|
| `npm run check` | 通过 | 四套 Schema、隔离、Token 双向绑定、21 条 Node 测试、四套 ESM、TypeScript、网站构建 |
| `npm run build` | 通过 | 最终封面 PNG 更新后再次构建；输出 dist/client/index.html、dist/server/index.js、dist/.openai/hosting.json |
| `npm run test:sites` | 4/4 通过 | 静态文件、页面回退、API/写请求边界和 Sites 产物 |
| `npm run test:consumer` | 通过 | 仓库外安装最终 tgz，公开子路径类型检查及 Vite 构建 |
| `git diff --check` | 通过 | 未提交改动的空白检查 |

四套：quiet-workspace、midnight-ledger、clearline-console、signal-studio。新增两套保持 experimental。

最终独立消费者：`C:/Users/Yueyu/AppData/Local/Temp/ui-design-lab-consumer-OoZLON`。其类型检查读取安装包的声明，未借用仓库源码入口。构建输出约 CSS 142.11 KB、JS 308.16 KB；这是四套工作台示例一起打包的大小。

`test:consumer` 曾因离线缓存缺少 @types/react 失败，之后通过官方 npm 源补齐依赖并重新成功执行。旧失败、早期消费者构建和旧页面错误不作为本次通过依据。

## 浏览器实测

使用用户当前的 Codex 内置 Chromium。通过浏览器控件改变状态，并检查 DOM、焦点、实际剪贴板、截图和已安装包的页面；没有声称另行运行了本地 Playwright CLI 全量套件。CI 复跑入口保留在 tests/browser/。

| 流程 | 已验证的行为 |
|---|---|
| 首页与目录 | 精选最多两套；全量目录包含四套；搜索包含精选；直接进入比较；封面实际加载完成 |
| 四套设置 | 编辑、失败保留输入、重试保存、本机保存、取消恢复 |
| 四套任务 | 筛选、失败任务重试、结果、跨页选择保留、清除选择、用量从 342 变为 362 |
| 四套表单 | 搜索无结果时保留原选择；多选；用 Enter 移除一项并保留另一项 |
| 四套浮层 | 菜单打开抽屉、Escape 关闭、焦点恢复到触发器；两条通知不覆盖 |
| 手机 Popover | 原生顶层可见、点击命中，390px 宽度下左右保留 8px；不受宿主动画 transform 截断 |
| 四套主题 | JSON 编辑/导入、再次导出一致、本机保存恢复、拒绝非法结构 |
| A/B 比较 | 编辑值与两个 false 开关保留；套系/密度/状态快照准确；实际复制、错误恢复、详情与空状态下一步 |
| 比较保存/分享 | 保存→修改→恢复；复制实际链接、重新进入还原负责人字段 |
| 原有两套 Dialog | 长页打开、原生模态、滚动锁、正反 Tab 循环、Escape 与焦点恢复；loading/disabled 内容不可进入；错误后能提交 |
| 运营报表 | 日期 9月2日–3日的区间用量 162；清空变 342；视图恢复回 162；明细下钻；导出模拟失败与重试；逆序日期拒绝应用 |
| 研究内容 | 保存新版本、取消编辑恢复、两个历史版本、载入旧内容 |
| 澄明后台总览 | 创建项目、搜索定位、选择并修改状态 |
| 信号创作间总览 | 创建内容、保存、修订记录 |
| 最终独立消费者 | 四套均完成任务重试→结果→用量更新，页面无横向溢出 |

日期测试使用原生日期段方向键提交变化；内置自动化的直接 fill 曾只更新 DOM 值，没有触发 React change，因此没有将那次操作当作筛选验证。

## 响应式与设计

- 首页/目录：1440、859、390px；其中 859px、390px 的目录和比较入口流程通过。
- 四套工作流与主题页：390px，无页面级水平溢出。表格自身保留横向滚动以保证列可读。
- 两套新系统总览：桌面和 390px 检查；窄容器下企业后台详情移至表格下方。
- 两套新系统与选定源稿的同画面比较及修订见根目录 `design-qa.md`。
- 最终复核的浏览器错误日志没有新增运行错误；已有 11:17/11:21/11:26 UTC 的开发热更新错误保留为历史记录，未清空或当作当前错误。

截图目录：`C:/Users/Yueyu/.codex/visualizations/2026/09/05/01a06f53-bd76-7fb2-bf9f-109e8d422bfb/`。

关键证据：homepage-final.png、mobile-popover.png、consumer-final.png、clearline-comparison-final.png、signal-comparison-final.png、两套 *-mobile.png。首页四套最终封面也保存在仓库 references/thumbnails/*.png。

## 具体覆盖限制

- 上传：文件类型/大小、失败重试、进度约束和忽略 AbortSignal 的迟到成功已通过真实适配函数测试。内置浏览器未覆盖系统文件选择器、真实拖放与生产文件存储；不能称为端到端上传上线验收。
- Firefox、Safari、触屏实体设备、屏幕阅读器、系统级缩放与 prefers-reduced-motion 的实际浏览器状态未全量验证。CSS 保留减少动态规则，主题提供局部颜色组合检查；不宣称全站 WCAG 合规。
- 场景使用明确的本地模拟任务/上传/导出。生产认证、持久存储、计费、模型、邮件和任务服务尚未集成。
- Claude Code、Cursor 提供使用说明；未实际启动验证这些工具。
- 真实收款、退款、订单、用户留存、外部试用、远端 CI、公开演示和 npm 发布尚未发生。商业与推广交付是材料，不是已获客或收入。

## 发布材料

ROADMAP.md 逐项记录 71 项主线及 7 项候选的证据。QUICKSTART.md、README.en.md、API、升级说明、商业与推广文档已同步。本地组件包不包含 Gallery 或第三方 references；Signal Studio 原创 WebP 随包保留 NOTICE。

## 2026-09-06 首页六处标注修订（第一轮记录）

此节记录第一轮本地改动，取代前文关于“精选两套＋第二份目录”的页面描述；不代表新增发布或推送。下文“套系差异化修订”已替代本节的统一内部封面布局与预览入口描述。

- 四个公共导航分别进入 `#/systems`、`#/kits`、`#/usage`、`#/compare`，统一导航样式和唯一选中态，支持刷新与浏览器返回。
- 所有套系集中在一个可搜索、可按浅色/深色筛选的目录；每套只出现一次。删除 Hero 重复入口、对比推广横条与第二份目录。
- 四套封面采用 760×480 的同场景真实组件组合，展示图表、两行数据表格、表单、按钮和状态反馈。预览点击进入组件页；静态封面隐藏表格工具栏，完整交互保留在组件页。
- 在 1334px 桌面宽度下，每张预览约 386px 高，介绍约 117px 高。四套图表、表格与表单均无容器裁切；手机为单列。
- 安装、接入说明下载与开发工具协作指导迁入独立使用方式页。套系缩略图、README、交付合同和 AGENTS.md 已同步。

| 本轮验证 | 最后有效结果 |
|---|---|
| `npm run check` | 通过：套系 Schema/隔离/Token、组件包、类型、网站构建与 21 项 Node 测试 |
| 最终 `npm run build`、`npm run test:sites` | 通过，Sites 4/4；三个托管产物存在，四个受保护基础文件未修改 |
| Chromium：gallery + compatibility | 18/18，包含四导航、刷新/返回、搜索筛选、组件入口、预览完整性及 320/390/720/859px 布局 |
| Firefox、WebKit：compatibility | 各 10/10，包含四套表单/浮层、预览、响应式、减少动态与指南下载 |
| 最终视觉检查 | 1334px 桌面、390px 手机；直接进入场景页样式完整，页面无横向溢出，捕获的控制台错误/警告为空 |
| `git diff --check` | 通过 |

日志位于 `.local-cache/catalog-check.log`、`catalog-build-final.log`、`catalog-sites-final.log`、`catalog-chromium-verified.log`、`catalog-compat-verified.log`。早期测试包含一次错误选择器及若干页面加载超时；修正定位并在构建结束后单并发复跑通过，保留旧日志，不将旧失败计作通过。

截图沿用上述截图目录：`catalog-desktop.png`、`catalog-mobile.png`、`usage-desktop.png`、`usage-mobile.png`、`kits-desktop.png`；四张独立封面在 `references/thumbnails/`。这些结果验证本地展示与交互，不覆盖生产后端、真实支付或实际商业转化。

## 2026-09-06 套系差异化修订

用户指出四套预览像是同一 UI 换颜色。代码核查确认封面使用了相同的组件布局；本轮取消公共层的内部排版，统一范围改为外部画幅、完整缩放和卡片文字层级。

- 静谧工作台：资料侧栏、文档阅读、真实后台任务组件和额度胶囊。
- 午夜账盘：反转资产面板、连续持仓、收益曲线、日历和敞口等七个终端面板。
- 澄明后台：六条项目记录、选中行、分页和并列的右侧详情。
- 信号创作间：横向导航、衬线标题、三张原创内容封面构成的非等宽画布，以及一条完整修订记录。
- 封面画布为 1140×720，比例仍为 760:480；套系 cover 样式只作用于缩略预览。点击封面进入套系总览，从内部导航继续浏览组件；手机不再常驻遮挡预览的操作标签。
- 修复终端持仓与策略面板、创作间修订记录的底部裁切和图片上文字的对比度；修复 861–1120px 顶部链接换行。
- 在 1334、924、390px 下，检查的关键区域均未超出画幅，页面无横向溢出；1334px 预览约 385px、说明约 117px。四套在手机预览中保留各自结构。

| 验证 | 本轮有效结果 |
|---|---|
| `npm run check` | 通过：四套 Schema/隔离/Token、组件包、类型、网站构建与 21 项 Node 测试 |
| Chromium：gallery + compatibility | 首轮 17 项通过；入口测试误用了页面模式的选择器，修正为总览标题并继续进入组件页后，定向复验 1/1 通过 |
| Firefox、WebKit：compatibility | 各 10/10，覆盖独立预览结构、三种缩略尺寸、导航返回、现有表单与浮层、响应式和指南下载 |
| 最终视觉检查 | 1334、924、390px 截图；关键区域无裁切，捕获的页面与控制台错误为空 |
| 最终构建、Sites | 最终 PNG 更新后 `npm run build`、`npm run test:sites` 通过；Sites 4/4，三个托管产物存在，四个受保护基础文件未修改 |

日志：`.local-cache/suite-identity-check.log`、`suite-identity-chromium.log`、`suite-identity-chromium-entry.log`、`suite-identity-compat.log`、`suite-identity-visual.log`、`suite-identity-build-final.log`、`suite-identity-sites.log`。截图在前述截图目录的 `suite-identity-1334.png`、`suite-identity-924.png`、`suite-identity-390.png`，独立封面在 `references/thumbnails/`。

范围与后续：本轮解决首页封面同构，没有重做全部套系内页。新增两套的部分基础表单、表格与业务组件展示仍相近，后续需继续完善各自的组件形态和完整业务流程；不能据此宣称四套都已形成成熟的差异化组件生态。本轮未提交、推送或发布。

## 2026-09-06 五套信息架构与组件边界修订

针对用户标注的栏目重复、组件不明确、总览面板无法独立使用，本轮检查并调整了当前全部五套。完整问题、分类、数量与代码责任见 [文档与组件审查](DOCUMENTATION-AUDIT.md)。

- 统一文档导航和独立组件详情；基础组件、业务组件、页面组合分开归类。实际登记为 137 个组件与 9 个页面组合，Folio 的 11 个 UI 导出包含 1 个整页工作区。
- 午夜账盘拆出七个业务面板；澄明后台拆出项目目录/详情，信号创作间拆出内容卡片/修订列表。总览和封面复用这些套系内的公开实现。
- 基础页读取实际 Token，规范按 manifest 呈现；修复 Windows 换行导致的段落混排，支持规范对照表。组件文档通过脚本核对实际导出、类型、状态、源码及能力登记。
- 修复持仓计数、真实月历对齐和空月份数据示例、无回调时的伪交互、封面裁切及资产标题对比度；旧链接继续可用，导航支持浏览器返回。
- 最终 `npm run check` 通过，包含 24/24 Node 测试；文档/导航/上传 19/19，后续状态与规范修订定向复验通过；最终独立 tarball 安装、类型、构建及 2/2 浏览器消费用例通过。详细执行批次与早期封面失败的修复证据见审查文档，未将多轮重叠用例相加为新的测试总数。

本轮交付是本地 UI 实现、组件可复用边界与文档一致性修订。保留既有工作区改动，未提交、推送或发布；示例中的资金、业务服务和协作功能仍以各套明确声明的实现范围为准。

## 2026-09-06 组件展示、基础控件与分步接入修订

按用户五处标注修改当前五套目录与接入页；表单改进由各套组件实现，不通过公共样式重新定义套系 Token。

- 组件目录移除固定画布缩略图与外层展示卡片，直接呈现可操作组件，保留短标题、用途及“用法与代码”入口。详情页保留参数、七态与源码。修复 Folio 记录详情在目录挂载时自动聚焦而滚动整页的问题。
- 静谧、午夜、澄明、信号新增独立 Slider 导出、类型、状态合同与目录；场景选择和主题编辑复用本套 Select、Field、Textarea、Slider、Button。输入、搜索、选择、滑块、上传按钮整理交互样式；支持 base-select 的浏览器使用本套弹出菜单样式，其他浏览器保持原生回退。修复 Quiet/Midnight 的旧 appearance 规则覆盖增强样式。
- 午夜标签调整圆角、字号、底色与留白；期权类别使用独立语义色，买卖及购/沽保持中性标签，盈亏用带符号数值与颜色表达。澄明与信号保留各自标签形态。总览段落标题移到组件外留白区；收益周期与指标参与正常排版，窄容器不再重叠。
- 五套接入统一为“准备组件包 → 安装到项目 → 放入页面 → 运行检查”四步，每步独立复制。页面代码、完整开发细节按需展开，保留一键复制 Codex 指令。步骤明确要求已有 React 19 项目及本地 tgz，不宣称已发布 npm 包。
- 当前登记为 **141 个组件、9 个页面组合**：Quiet 35/2、Midnight 40/2、Clearline 28/2、Signal 28/2、Folio 10/1。四个新增滑块同步到独立消费者的类型正反例。

验证批次分别记录，不把重复用例累加为独立覆盖数：

| 验证 | 有效结果与日志 |
|---|---|
| `npm run check` | 五套隔离、Schema、Token、文档、组件包、类型、网站构建及 24/24 Node 测试通过；`.local-cache/refinement-check-final.log` |
| Chromium 回归 | 首轮 63/63；下拉样式修订后相关流程 21/21；标签修订后午夜 2/2；分别见 `refinement-regression.log`、`refinement-select-final.log`、`refinement-label-final.log` |
| Firefox / WebKit | 各 12/12，通过选择框、滑块键盘、表单、浮层、Folio 与文件选择；`refinement-compat-final.log`。首次因默认缓存目录没有程序而无法启动，改用项目缓存后实测通过 |
| 仓库外安装与运行 | tarball 安装、类型检查、构建通过；独立项目交互 2/2 与组件文档 8/8 通过；`refinement-consumer-final.log`、`refinement-consumer-browser.log` |
| 视觉检查 | 1674px 组件、总览、主题、指南及 390px 手机截图；展开菜单实际使用套系样式；三种封面尺寸及图表摘要边界 1/1 通过，见 `refinement-cover-final.log` |

截图位于 `.local-cache/refinement-*`；更新午夜、澄明、信号的首页缩略图。四个托管基础文件保持完整。本轮为本地实现验收，未提交、推送或发布。

## 2026-09-06 组件目录组织修订

后续用户指出三列真实组件仍然混乱。首次调整为文字索引后，用户明确要求恢复组件展示。最终目录按用途分组展示真实交互预览，小控件两列对齐，宽组件独占一行，手机单列；标题链接独立详情页。保留可搜索侧栏、章节定位、相邻组件与手机组件选择，组件本体不加额外外框。

官方参考、问题根因、代码职责、覆盖范围与验证日志见 [组件文档组织参考](design-references/component-documentation.md)。五套的 141 个组件和 9 个页面组合计数保持不变。

恢复真实预览后，最终 Chromium 7/7 通过（`.local-cache/component-visual-index-final.log`），套系校验通过，最终网站构建通过（`.local-cache/component-visual-index-build-final.log`）。实际检查 1440px、1176px、390px 分类预览截图；控件可操作、标题可进入详情、宽组件无预览溢出。

## 2026-09-06 紧凑组件方块

用户进一步要求简明、按方块展示，纠正上一阶段文字和间距过多的问题。当前目录删除重复别名、用途段落和分类解释，每块仅保留名称与真实预览；12px 块间距，小控件最多三列，业务面板两列，表格与编辑器跨列，手机单列。此布局取代上一节的无框宽行方案。

Chromium 7/7 通过，日志为 `.local-cache/component-tiles-tests.log`；重新检查 1440px 与 390px 画面，桌面首屏可展示两排表单预览。套系校验和网站构建记录于 `.local-cache/component-tiles-build.log`。

## 2026-09-06 全目录顺序完善

五套目录统一按业务、数据、布局、导航、表单、通用操作、反馈浏览；每类内部按组件用途显式排列，脱离源码导出顺序。午夜账盘保留资产、收益、持仓、日历在前，静谧首排任务灯与资料树，页集先数据库与内容块，澄明先项目列表与详情，信号先内容卡片与修订列表。通用数据表仍位于业务分组末尾；详细顺序及理由见 [组件文档组织参考](design-references/component-documentation.md)。

分类完整性、套系校验、构建通过；浏览器 7/7 通过（`.local-cache/component-order-browser.log`），静谧最后的相邻组件调整后定向 1/1 通过（`component-order-quiet-final.log`），最终构建日志为 `component-order-build-final.log`。五套目录实际顺序见 `component-order-visual.log`，加载完成后的首屏截图为 `.local-cache/component-order-<suite-id>.png`。不把重复复验累加为独立用例数。

## 2026-09-06 Appica 参考陈列

五套组件目录改为自然高度接续排列，完整面板去掉重复展示外框，基础控件保留轻量承托面。名称和详情链接移至预览下方，业务优先、组件真实操作与套系隔离保持不变；宽组件跨列，手机单列。此版本更新此前的等高方块方案。

Chromium 13/13 通过（`.local-cache/appica-layout-browser.log`），覆盖五套的三种窗口宽度、重叠/溢出、搜索、详情入口、浮层、通知增高与缩放保留输入。套系校验、分类完整性测试和网站构建通过（`appica-layout-suite.log`、`appica-layout-build-final.log`）。实际检查五套桌面截图与手机截图，见 `.local-cache/appica-layout-*.png`。本轮仅调整 Gallery 陈列，不新增组件能力，未提交、推送或部署。

## 2026-09-07 场景与接入、使用方式优化

两个公共页面统一中性字体、标题层级和控件样式。场景页改为四个真实界面预览、分类筛选和短能力摘要；预览展示页面首屏区域，入口打开完整可操作示例。内部试价移回商业准备文档，公共页面保留 MIT、第三方素材与交付范围说明。

使用页支持五套选择、新建/已有项目、四步独立复制和执行目录提示；套系与项目类型同步到 URL，刷新保持选择。从场景进入会带入对应套系和目标场景，开发工具指令随选择更新。代码详情、Notion 研究和本机反馈按需查看。修复同一套系切换任务/研究链接仍显示旧场景的问题，并重新捕获不同的真实预览。

| 验证 | 最后有效结果 |
|---|---|
| 套系与组件文档校验 | 通过，`.local-cache/public-pages-check-final.log` |
| 网站构建 | 通过，`.local-cache/public-pages-build-final.log`；生成三个 Sites 托管产物，四个托管基础文件无改动 |
| Chromium 回归 | 11/11 通过，`.local-cache/public-pages-browser-verified.log`；覆盖公共导航、五套组件指南、场景链接、刷新同步、复制和下载、无效参数回退 |
| 响应式与视觉检查 | 1440、900、390px 无页面横向溢出，展开代码仍可复制；截图为 `.local-cache/public-pages-{kits,usage}-{1440,900,390}.png`；另检查实际浏览器套系下拉菜单 |

上一批与构建同时执行的回归为 10/11，对比页刷新后仍在加载而超时。构建结束后保留原断言与等待时间，完整复验为上述 11/11；不合并重复批次计算覆盖数。

本轮验收范围为本地页面和交互，没有重新验证所有独立项目的实际安装，也未接入真实业务服务、支付或云同步。未提交、推送或发布。
