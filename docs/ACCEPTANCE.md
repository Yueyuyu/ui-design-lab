# 2026-09-06 Beta 送测收尾

候选版本：1.0.0-beta.1。本次重新运行工程、浏览器与独立包验证；下方 9 月 5 日内容保留为历史记录。未创建本次候选的 GitHub Release、部署网站、发送试用邀请或开通收款。

## 2026-09-06 源码提交与推送

- `a9fe276`：开源许可、第三方素材与付费交付边界，已推送至 `origin/main`。
- `3ad9115`：四套 UI、组件分发、Beta Starter 与测试，已推送至 `origin/main`。
- 推送前再次运行 `npm run check`（含 21 项 Node 测试）及 `npm run test:sites`（4/4），均通过；四个 Sites 基础文件保持不变。
- `025a926`：持续集成与交付文档，已推送至 `origin/main`。首次远端验证发现 `check` 在构建之前执行 Sites 产物测试；本机已有构建产物掩盖了这一顺序问题。已将构建前置，保留原有测试断言；修复后的实际结果以 [GitHub Actions](https://github.com/Yueyuyu/ui-design-lab/actions/workflows/quality.yml) 的对应提交为准。

源码推送、远端验证、Release、npm 发布、网站部署和真实试用分别记录，不能相互替代。

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
