# Prototype Instructions

- 2026-09-24 简短 Agent 指令与 GitHub 同步：用户要求复制内容简短，资料读取和接入细节由 Agent 自行完成。主指令只保留套系名称/ID、GitHub 上的消费指南入口和设计任务（有来源示例时增加一句参考），不附完整 DESIGN、API、类型或安装检查长文。完整流程集中维护在 skills/consume-suite/SKILL.md，随源码与组件包分发；接入指南须能在未安装包时引导获取同一提交的源码，按实际技术栈接入，继续允许推导新页面与新增组件。用户已授权将缺失套系、规范及此接入路径同步至 GitHub；不把源码同步描述为 npm 发布或业务上线。

- 2026-09-24 Agent 接入来源修订：用户明确要求使用 GitHub 地址。复制接入指令以 https://github.com/Yueyuyu/ui-design-lab 的源码为入口，不再根据当前页面 origin 构造本机组件包地址，也不依赖本地下载清单。Agent 先固定实际读取的提交 SHA，再核对所选套系目录、规范、版本与接口；React 按该提交的构建脚本生成包，其他技术栈读取设计语言。页面附录不代表远端已同步，缺失资料与导出须如实说明；不虚构 Release 附件或发布状态。此条更新此前主指令携带本地包地址与哈希的约定，手动下载仍独立保留。

- 2026-09-24 使用方式选择器反馈：用户连续圈出套系选择器展开后的原生菜单，指出其显示与公共页面脱节。展开列表也应沿用公共字族与可读字阶、预览缩略图、中英文层级、浅灰选中态与勾选标记；不能只美化收起状态而留下系统小字菜单。保留键盘导航、取消/外部关闭、窄屏滚动与“开发中”不可选，接入内容继续跟随套系选择。

- 2026-09-23 使用方式选稿：用户选中第 1 版，精确参考为 references/usage-agent-selected-20260923.png。主流程为“选择设计套系 → 复制接入指令 → 粘贴给 Codex 或其他 Agent”，首屏采用居中标题、带场景缩略图的套系选择器和单一满宽主按钮；不增加 Agent 选择或项目类型步骤。下载、安装、新建/已有项目、研究与反馈收进默认折叠的“手动接入”。指令随套系选择更新，必须包含真实可获取的组件包地址、版本、完整性信息、设计规范与扩展方法；先读设计语言再核实 API，允许在业务项目推导新页面和新组件，不以现有导出限制设计范围。本机地址须说明可达范围，不冒充 npm 发布或已完成外部接入。

- 2026-09-23 应用示例归属修订：用户同意移除顶级“场景与接入”，公共导航保留“设计系统 / 使用方式 / 同场景对比”。真实可操作场景归入各套系的“应用示例”（沿用 patterns 路由），原页面组合与流程文档深链保留；旧 #/kits 兼容显示设计系统目录。示例进入前后明确所属套系、设计用途、可尝试操作、示例数据及真实服务边界，并提供设计规则、组成组件、用于我的项目三条后续路径。说明层沿用公共字族和字阶，示例画布保留本套 Token 与布局；没有独立示例的套系如实说明，不用宣传概念图冒充。示例只展示一种用法，不能限定套系推导新页面与新组件的范围。此条更新此前四个公共入口和独立场景目录的约定。

- 2026-09-23 公共页面统一：用户要求“场景与接入、使用方式、同场景对比”的字体与布局跟随“设计系统”页。四个入口共享中性配色、本地中文字体、居中标题、1487px 容器与响应式留白、正文/辅助字阶及控件规则；分别保留场景目录、顺序接入步骤、单画布 A/B 对比的任务结构。公共样式不得覆盖套系画布内的字体、Token 和组件；选择、复制、下载、对比数据保持等行为继续有效。

- 2026-09-23 首页成熟度文案：用户确定首页使用“稳定版 / 预览版 / 开发中”，分别映射 stable / experimental / draft。仅改面向用户的标签与对应搜索文案，不改变 manifest 中的成熟度或版本承诺。

- 2026-09-23 外观模式标识：用户圈出首页卡片的“浅色 / 深色”，要求增加视觉设计，不能只以普通文字呈现。使用紧凑、有边界的模式徽章；浅色为暖白表面与太阳，深色为深蓝灰表面与月亮，同时保留清晰文字。徽章说明套系支持的外观，不伪装成可点击的主题开关；模式继续来自 manifest。

- 2026-09-23 首页标题精简定稿：用户指定截图 codex-clipboard-a9034381-b74b-4610-b37e-c8ac45b250d1.png，标题与副标题严格使用“探索设计体系”“为你的产品，找到合适的设计语言。”，居中展示；移除原左右 Hero、设计方法说明/标签和重复目录标题，搜索与唯一套系目录保留。GitHub 入口依 codex-clipboard-20a45b81-ba5c-4407-bedf-e652c3d40077.png 使用官方圆形反白 Octocat 标志，保留 GitHub 文字与外链箭头，不能再用整只猫造型的通用 GithubLogo 图标代替。此条取代此前保留原 Hero、标题待选的决定。

- 2026-09-23 公共字体组合选稿：用户提供精确原图 exec-c91273b5-35dd-487d-9b13-f2924fe3b60b.png 与 exec-94b2073a-f009-4a3e-b394-4710aa153c06.png，组合采用前者的分组胶囊页头和后者的目录文字层级。页头包含上下品牌文字、浅灰导航容器、深色当前项和 GitHub 图标入口；目录采用英文主名与中文副名、分行用途/场景/元数据、清晰的中文无衬线、较大正文和辅助字号。参考与映射保存在 references/public-typography/。只落地公共排版，八套场景原图继续使用既有精确选稿；探索图省略 Hero 不代表删除 Hero，也不把未选定的标题文案当作已确认。

  实现使用公共层本地 Noto Sans SC 中文字体子集，400–700 可变字重，英文优先 Segoe UI；字体、覆盖字符与 OFL 许可证位于 src/gallery/fonts/。不改套系字族，不增加外部字体请求；公共文案增加新字形时按该目录说明更新子集。

- 2026-09-23 Pulse 胶囊拖动：整个侧轨可抓取，超过 6px 阈值才启动拖动，小移动仍点击；拖动后隔离 click。自动贴边默认关闭，可开关；Windows 由宿主持久化。只防整个侧轨移出工作区，保留可抓取边缘，展开详情不能挪动侧轨。Lab 仅演示，不连接本机设置；不更改 Pulse 视觉或 Quiet Workspace。

- 2026-09-23 公共页头优化：用户针对顶部导航截图要求同时优化大小、字体与 UI，先提供多个视觉方案再选稿。探索重点为品牌标志与文字比例、菜单可读性、页头高度、区域间距、选中态及 GitHub 入口；保留中性公共层与现有四个导航入口，未选定前不直接替换正式页头。

- 2026-09-23 公共字体范围补充：用户进一步框选首页原则说明与标签、目录标题与介绍、搜索框，以及预览图下的套系名称、用途、场景和元数据，要求全部优化。后续选稿需同时展示公共字体、字阶、字重、行距、对比和信息排布；不能只放大主标题或导航。预览图内部仍保留各套独立语言，标题文案与页头尚未选定时不擅自当作已确认。

- 2026-09-22 设计语言消费：用户再次强调套系必须使 Codex 能作为本套设计师为业务项目推导新页面、新组件，现有组件清单不是设计范围上限。消费路径先读取 DESIGN.md、standards/extension.md、Token 与布局/交互规则，再读取 API；优先复用，缺少时在业务项目内沿本套规则新增。不得把“不能编造包导出”误写为“不能新增组件”。固定的场景壳、主题改色和营销文案不能替代具体设计方法；扩展规范须随包交付并进入复制的 Codex 上下文。

- 2026-09-22 封面最终选稿：用户通过八张原始生成图明确选中静谧第 5 版个人复盘、午夜第 1 版交易工作台、澄明第 3 版库存工作表、信号第 3 版独立杂志网站、页集第 1 版团队知识库、果序第 2 版个人文件库、对谈第 3 版内容搜索、脉点第 1 版开发中的状态查看。精确原图映射见 references/scene-covers/selections.json。首页沿用已选画廊结构，将八套完整陈列在同一目录；选中场景作为宣传图保留原构图，不等同于新增可运行工作台。场景名称与宣传短句归属 suite.json 的 selection，显式标注应用概念；原组件封面与真实能力入口保留。

- 2026-09-22 预览构图纠正：用户指出生成的应用场景反复出现左侧功能栏，造成页面骨架同质化。套系统一的是配色、字阶、间距、组件与交互规则，不是固定的后台外壳。六版探索须先拉开导航与内容组织方式，再区分业务场景；按任务选择顶部导航、全宽画布、分栏编辑、内容阅读或确有必要的侧栏，不把参考图的左侧功能栏机械继承到每一版。该反馈不等同于全面禁止侧栏。

- 2026-09-22 首页选稿：用户选中本轮首页六稿中的第 1 张（场景作品画廊），精确参考为 references/homepage-gallery-selected-20260922.png。采用中性公共外壳、左侧主标题与右侧简短价值说明、单一可搜索目录、桌面两列完整场景画幅、图下套系名称与用途。接着为每套体系各探索六版场景预览；公共层统一画幅和文字层级，场景内部结构按套系设计语言独立设计。预览概念不等同于已实现的功能或实际采用证据。

- 2026-09-22 首页与套系表达修订：用户要求先探索整体首页的六个不同设计方案，再为每套体系分别设计六版预览图。方案应在结构、层级与展示方式上有实质差异。首页封面以能看懂功能的完整应用场景呈现套系设计语言，取代此前以组件精选拼盘为主的封面策略；场景只是应用示例，不限定套系用途。套系的核心价值还包括可供 Codex 读取并延伸的配色、排版、布局、组件与交互规则，用于设计用户自己的页面和新组件，不能仅被描述为现有组件集合。公共首页保持中性，套系内部保留独立设计语言。

- 2026-09-22 额度授权：Companion 按本机接口/有效缓存→对应桌面登录→手动备用网页登录读取，默认不要求重复登录。共享 UI 显示受控来源、停止读取和恢复按钮；停止偏好由宿主持久化，页面不接收令牌、Cookie 或凭据路径。Lab 保持固定示例，不接账户。Pulse 造型/动效不因授权流程改画。

- 2026-09-21 应用显隐：真实 Companion 只传入已打开的桌面应用；关闭即隐藏对应图标，全部关闭为空列表，不能自动补出 Codex 或示例。选中应用被移除时切换到仍存在的首项；该应用重新加入不抢回选择。登录与图标偏好由宿主保留。Lab 示例不读取真实进程。

- 2026-09-21 桌面悬停稳定性：Companion renderer 使用固定宽度及预留高度的透明画布，使圆环在展开/收起时位置不变，避免 WebView 与宿主两次位移产生残影。此为 Windows 专用承载修正，不改变 Lab 侧轨造型与 320ms 收起约定；透明预留区必须排除原生鼠标命中。

- 2026-09-21 后台与应用分项：桌面 Companion 获准迁移为登录后台自启、随 Codex 运行显隐；每个真实已接入应用独立一项，品牌图标/机器人选择按应用保存。Lab 仅演示多应用，不把示例当成 Cursor 已接入；沿用 Pulse 视觉，旧安装保留可回退。

- 2026-09-21 Pulse 收起反馈：点击展开不等于固定。未固定时移出 320ms、点击外部、失去窗口焦点或打开任务后收起；只有显式固定才常驻。快速跨过轨道/面板间隙可取消收起，贴边来源退回贴边，键盘操作不因静止鼠标在外而关闭。

- 2026-09-21 最新接入决定：Companion 桌面宿主获准连接真实只读业务；Lab Gallery/Playground 始终使用示例，不建立账户或本机业务通道。共享组件通过受控 props 接收额度与任务各自的读取状态、重置文案及来源标签；实时桌面不允许回落到 69% 或示例任务。

- 2026-09-21 直接复用实施：Pulse 原版黑色配色优先于早期白色草稿；采用 64px 侧轨、环下百分比、现成 OpenAI SVG / Bot 资源及上游人格编排。Windows 使用 WebView2 共享 renderer，不再二次自绘。允许原版 hover 预览（320ms 离开宽限），同时保留点击、固定、键盘。机器人第三方授权未解决，仅放 gitignored .local-cache，不纳入公开 build/push。真实业务接入与替换旧安装仍待视觉确认。

- 2026-09-21 最新纠正：用户要求直接复用 Pulse 已有完整设计，而非重新设计机器人或另造“小搭子”。“独立套件”指目录/Token/发布边界独立，不代表必须原创视觉。优先保留上游造型、颜色、比例与动效，通过适配器保留 Companion 业务；仅因平台差异移植渲染，不自行改画。先前自绘机器人只是未获认可的草稿，不作为下一阶段的视觉基准。沿用静态开关、低动态偏好与卸载清理；Quiet Workspace 与正式 Companion 不变。上游复用的来源、许可证及尚未解决的机器人素材权利见 systems/pulse-desktop/UPSTREAM.md；不能把 Pulse 根 Apache-2.0 许可证宣称为覆盖全部第三方素材。

- 2026-09-21 用户明确授权新增独立 Pulse-inspired 桌面设计验证套件：`pulse-desktop` / 脉点桌面，`pd-` / `Pulse*`，当前 draft。先验证紧凑、展开、贴边三状态及真实 Windows 窗口，不覆盖 Quiet Workspace，不替换 Companion 正式组件。白色实体表面，额度与任务语义分离，点击而非悬停展开；关注完成项保留。示例数据必须持续标注；背景仅属 Gallery。真实桌面、多缩放验收与用户视觉确认后，再接现有只读业务能力。不得把本轮原型宣布为已安装或新正式版本。

- 2026-09-18 组件表达修订：用户提供 Appica 组件陈列截图，明确希望网站体现可选用的图标、控件与完整局部组件，避免首页仅缩小整页后台。首页套系封面改为本套真实组件精选，应用图标、界面符号、输入、命令、反馈与内容组合应可辨认；完整工作台保留在场景入口。此决定更新此前以整页场景作为封面主体的要求。目录“全部”视图采用连续自然高度陈列，分类保留筛选和浏览顺序，不为每个小类别留下独立空段。
- 图标能力区分语义符号、应用图像和交互入口；图标选择器、应用入口与命令菜单须有真实回调、键盘、禁用/加载/错误状态、类型和独立文档。原创应用图像与第三方品牌图标分开，不把 Phosphor 符号宣称为 Apple 官方图标；用户截图仅用于陈列参考，不复制浏览器私有信息与 Appica 素材。

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## UI Design Lab Decisions

- UI Design Lab has two product layers: a neutral public discovery homepage and a suite-owned interior. The homepage must not inherit any suite tokens; after entry, the sidebar, top bar, controls, and workspace shell all adapt to the active suite.
- The homepage uses one searchable suite grid. Every registered suite appears once with the same preview and metadata structure; do not split featured suites and a second duplicate directory. Use two columns on desktop and one on mobile.
- Homepage cards, the full directory, and the in-suite switcher all consume `src/registry/suites.js`; suite names or counts must not be hardcoded in the app shell.
- This repository contains multiple independent visual systems. Shared code may provide gallery/build tooling only; suites must not import another suite's tokens, components, patterns, or assets.
- A suite is a complete visual language; light/dark modes and comfortable/compact densities are variants inside a suite, not new suites.
- Every registered suite lives at `systems/<suite-id>/`, has a stable kebab-case `id`, a unique short CSS prefix, and a machine-readable `suite.json`. Display order is presentation metadata and never replaces the suite ID.
- `src/registry/suites.js` discovers suite manifests and showcase loaders. The Gallery must not hardcode a suite list or directly import a specific suite from the app shell.
- Each suite provides `DESIGN.md`, foundation tokens, seven-state interaction contracts, component exports, standards, and a suite-local `showcase/` module. `tokens.json` and implemented components remain canonical when prose drifts.
- Gallery suite URLs use `#/systems/<suite-id>/<page>` so static Sites hosting can deep-link without server rewrites.
- Standard suite navigation includes overview, foundations, components/states, guidelines, patterns, Playground, and usage. Unsupported capabilities must be declared rather than silently imitated.
- When a user names a suite ID, Codex must read that suite's `suite.json`, `DESIGN.md`, foundations, standards, and component entrypoint before implementation; it must then run `npm run suite:check`.
- New suites start as `draft` and do not become `experimental` or `stable` until a visual source is selected, component states are documented, the showcase is implemented, and validation passes.
- The first suite is `quiet-workspace` (`Quiet Workspace / 静谧工作台`) and uses the `qw-` class prefix, `--qw-` token prefix, and `[data-ui-system="quiet-workspace"]` scope.
- The visual source of truth is `references/quiet-workspace-source.png`.
- Quiet Workspace is light-first, Windows-friendly, warm editorial utility design. Its canonical font stack is `Segoe UI Variable`, `Segoe UI`, `Microsoft YaHei UI`, then system sans-serif.
- Keep source reference presentation scenery separate from core design tokens. The dark desktop backdrop belongs to gallery/demo presentation, not the suite's product surface tokens.
- Reusable suite code lives under `systems/<suite>/`; the gallery app under `src/` consumes suites but must not redefine their visual tokens.
- Quiet Workspace UI text must not use 9px sizes. Auxiliary text starts at 11px with at least 4.5:1 contrast; control labels and critical compact content start at 12px.
- Every reusable component documents default, hover, pressed, focus, disabled, loading, and error states. When a container has no direct hover or pressed behavior, the state is expressed through its owned control or content state and documented explicitly.
- Quiet Workspace supports `comfortable` and `compact` density. The desktop task light is always compact, independent of the Gallery density switch.
- Phosphor is the canonical icon family. Charts, Chinese copy, and motion must follow the suite standards under `systems/quiet-workspace/standards/`.
- Status carriers follow the information type instead of sharing one decoration: concurrent categorical task states may use dots or rails, while one scalar quota uses a tonal pill surface.
- The compact quota pill shows only the percentage. It never adds a status dot, icon, or persistent label; its accessible name carries the missing context.
- Quota thresholds are `>40%` healthy, `21–40%` caution, and `≤20%` critical. Each tone pairs a very light surface with a low-saturation dark text from the same hue family; near-black bold text is not allowed on the tinted pill.
- The quota details panel remains a white paper surface and does not inherit the pill tint. The pill is high-frequency UI, so it has no ambient animation; only short hover/press feedback and an origin-aware popover transition are allowed.
- The second suite is `midnight-ledger` (`Midnight Ledger / 午夜账盘`) and uses the `ml-` class prefix, `--ml-` token prefix, `[data-ui-system="midnight-ledger"]` scope, and `Ledger*` component names.
- Midnight Ledger is one UI system grounded in three sources: `references/midnight-ledger-source.png`, `references/midnight-ledger-compact-source.png`, and the captured `https://theclues.pro/cockpit` view at `references/midnight-ledger-live-source.png`.
- The live Cockpit values are authoritative for the core palette and density: `#1C223A` canvas, `#20263C` sidebar, `#252A40` card, `#E5D4B6` primary text, Inter 14px, 12px card radius, and low-opacity cream borders.
- Midnight Ledger is a general UI system, not an AI-agent product template. Product examples may include financial data, but suite naming, components, standards, and Codex instructions must not imply that the system exists only for AI workflows.
- Gallery comparison is allowed to import multiple suites under separate nested scopes. Suite implementation code itself must remain isolated and must not import another suite.
- Component state showcases must remain compact and informative: loading states include visible progress context, while error states use a normal-sized icon, a concise explanation, and a recovery action instead of a near-empty card or oversized symbol.
- The neutral public homepage uses restrained, readable typography. Its primary navigation has a clear shared container and active state; comparison and onboarding flows must read as complete components rather than disconnected text, lines, or table fragments.
- Same-scene comparison uses a single A/B canvas with instant switching, never two independent full pages side by side. The selected visual source is `references/comparison-workbench-source.png` (concept 02).
- A/B comparison keeps scene data, component state, form values, settings, and the canvas scroll position unchanged while switching suites.
- Detailed comparison happens at the corresponding module level with shared row heights. Each suite keeps its own component anatomy; the Gallery must not force complete pages into identical heights.
- Suite A/B selectors consume `src/registry/suites.js` and must continue to work when more suites are registered. A suite without a comparison renderer is declared unsupported instead of being silently imitated.

- Homepage selection metadata (maturity, suitable tasks, limitations, reference thumbnail) belongs in suite.json. The single directory searches every registered suite; mobile retains public navigation and the suite directory entry.
- Comparison renderers live in each suite's comparison/index.jsx and are loaded by the registry. Exported Codex instructions carry a scene-specific JSON snapshot, preserving edited values and false settings.
- Dialogs use suite-local Portal/native modal implementations with focus containment, background scroll locking, and focus restoration. Loading/disabled content is inert while the close control remains available.
- Token changes update foundations/token-bindings.json and must pass bidirectional JSON/CSS checks. Component distribution is a local ESM tarball with types; third-party references are excluded and remain governed by NOTICE.md.

- 首页所有套系的宣传封面统一外部画幅、完整缩放规则和卡片标题、说明、元数据的字体层级。内部导航、布局、排版、密度和组件组合由套系自己决定；禁止为了统一宣传形式，把不同套系强制塞进同一布局后仅换色。
- 首页套系展示应更紧凑，避免大幅封面挤占首屏，并适应后续套系数量增长。先统一公共展示规范，再扩展套系；套系内部仍保留各自的视觉语言。
- 2026-09-06 标注修订：首页取消重复 Hero 操作、对比推广横条、第二份套系目录和三步说明区。预览采用 1140×720 画布（比例仍为 760:480），随卡片宽度完整缩放；说明仅保留标题、一句用途、成熟度、组件数、模式与版本。公共导航的设计系统、场景与接入、使用方式、同场景对比各有独立 hash 路由和唯一选中态；安装和开发工具指导集中在 #/usage。
- 套系识别不能依赖颜色：静谧工作台展示文档阅读、资料侧栏、后台任务与额度胶囊；午夜账盘展示反转资产面板和高密度多面板终端；澄明后台展示可选择的项目表格与右侧详情；信号创作间展示横向导航、衬线标题和非等宽内容画布。即使去掉颜色，也应能从结构认出套系。封面优先复用本套已有页面与组件，公共层只负责画幅和缩放。
- Notion 产品设计研究保存在 docs/design-references/notion-ui.md，通过 #/usage/notion 查阅。研究文档与已实现套系分开登记；建议尺寸不是第三方官方 Token，组件清单不是现有导出。引用第三方产品时区分官方事实、设计观察与项目建议，不导入私人工作区内容作为公开示例。

- 用户已授权完整路线初步实施，常规实现与选稿由代理自主完成。新增 Clearline Console / 澄明后台（clearline-console，cc-，Clear*）采用白色表格与侧向详情；Signal Studio / 信号创作间（signal-studio，ss-，Signal*）采用横向导航、衬线标题与原创内容封面。两者仅浅色，不把主题改色计为新套系。选定来源分别为 references/clearline-console-source.png、references/signal-studio-source.png。
- 2026-09-06 用户明确要求研究 Notion 产品界面并新增独立 UI。第五套为 Folio Workspace / 页集工作台（folio-workspace、fw-、Folio*），以页面树、纯文本块编辑、内嵌三视图数据库和非模态侧开详情建立识别。视觉参考为 references/folio-workspace-source.png 的官方块示例，第三方权利见 NOTICE.md；原创示例不得使用私人 Notion 工作区内容。仅浅色/舒适密度、本地保存；禁止宣称富文本引擎、拖拽、实时协作、权限或云同步已实现。研究页链接实际套系，manifest 中 starter 指向真实 FolioWorkspace 入口。

- 2026-09-06 组件分类修订：每个公开 UI 导出必须在套系组件文档中有独立 ID、用途、组成、实际预览、类型接口、七态与源码。基础组件完成单一表达/动作；业务组件完成局部任务；完整工作区属于页面组合，不混入组件数量。导航只保留一个组件目录，页面与连续流程合并归类，禁止多个栏目映射同一拼盘。总览中的独立业务面板优先复用真实公开组件。
- 2026-09-06 展示与接入标注：组件目录直接呈现组件本体和短标题，不再套外层宣传卡片或缩成固定高度缩略图；基础组件也提供真实预览。套系内的演示下拉框、输入和滑块复用本套组件；标签须保持清晰读数和准确类别语义。总览段落标题位于组件外部留白区，不贴着突兀的背景边框。接入指南以顺序步骤和逐步复制为主，完整 API、作用域与开发工具细节按需查看，避免默认铺满页面。
- 2026-09-06 组件陈列最新反馈：用户既要简明，又要一块一块展示组件；目录采用紧凑、有轻边界的组件方块，每块只保留短名称和真实可操作预览，移除逐项说明、英文别名和分类解释，缩小块间距。宽屏小控件三列、业务与数据面板两列；表格、数据库和编辑器按内容跨列，手机单列。组件不裁切、不缩成图片；名称链接完整详情，保留搜索与分类。此决定取代此前“无外框、两列大留白和业务面板整行陈列”的方案；详细用法、参数、七态与源码保留在单组件详情。
- 2026-09-06 组件展示顺序：先展示体现套系特色的完整业务组件，再展示按钮、输入框等基础控件。午夜账盘开头依次为资产摘要、收益表现、持仓列表、盈亏日历；通用数据表移至业务分组末尾。目录、分类标签、侧栏与详情前后跳转共享顺序；不得把基础控件优先级当成组件展示优先级。
- 2026-09-06 全目录排序完善：统一按业务组件、数据展示、布局容器、导航、表单输入、通用操作、反馈与浮层浏览，组内顺序显式维护在 component-groups.js，不依赖组件导出顺序。静谧先后台任务灯与资料树，再额度胶囊和文件上传，避免小胶囊占首排高面板的大格子；页集先多视图数据库与内容块编辑器，澄明先项目目录与项目详情，信号先内容卡片与修订列表；午夜保留首四项，再月度收益、敞口和策略。普通表格与图表先于指标标签；表单按文本、选择、开关数值、日期组织；反馈先可展开的浮层，再通知、空状态、进度与加载占位。
- 2026-09-06 Appica 陈列参考：用户认可 https://appica.dev/ui 的组件本体主导、自然高度和多列紧凑接续。五套目录取消同排拉等高，已有面板不再套重复外框，基础控件保留轻量承托面；短名称与详情入口移到预览下方。保持业务优先顺序和真实操作，宽表格/编辑器跨列，手机单列；不为填空打乱 DOM/键盘顺序，不复制 Appica 的品牌、素材或组件代码。此决定更新此前的等高方块呈现。
- 2026-09-07 公共场景与接入页：用户要求一起优化“场景与接入”和“使用方式”的 UI、字体和内容。场景页以真实场景截图、短用途与能力摘要帮助选择，明确截图为首屏区域，并让场景入口带入对应套系。使用页先选择套系与新建/已有项目，再按执行目录逐步复制命令；开发工具指令随选择更新，研究与本机反馈收在后方。两页使用中性公共字体与控件，不继承套系 Token。内部试价留在商业文档，不作为公开商品报价；免费许可与真实服务边界仍可查看。

- 2026-09-18 采用优先：先完善五套真实消费能力，不新增第六套或改色套系。Folio 对比以记录整理为共同任务，与 Clearline 保留不同组件结构；不要求知识套系模拟经营图表。Clearline 项目运营、Signal 内容编辑作为独立场景进入公共入口和 Starter。
- 完整工作台应声明数据所有权及读取/异步保存接口；失败保留草稿，关闭取消请求并忽略迟到返回，成功结果才更新列表。默认本地演示与真实服务采用证据分开。
- 套系索引和兼容性表由 manifest 生成并校验；stable 仍是 API/维护承诺，真实项目采用另行记录。消费技能需支持已安装包路径，不能要求业务项目具备实验室 suite:check 脚本。

- 2026-09-18 用户授权按阶段连续优化，无需阶段性确认。优先打通独立场景体验、组件浏览、直接下载接入，再逐套优化版式、字阶、密度与真实操作，最后验证实际采用；不新增套系。公共入口保持中性，工作台桌面优先，手机保证选型与接入。真实项目路径、参与者和上线结果必须有实际证据。
- 独立场景使用 #/scenes/<kit-id>，只保留返回、重置、文档与采用工具；原文档深链继续可用。组件目录保留单一搜索，详情保留组件索引。直接下载由当前源码生成版本化包与 Starter，不能冒充 npm 已发布。

- 2026-09-18 套系定位更新：用户明确希望将 Apple、ChatGPT、小米等成熟产品或平台的设计理念转化为可跨项目复用的独立套系。套系以设计语言组织，场景属于套内页面组合；同一套可覆盖设置、资料、任务、对话等多种业务，不以单一软件页面或业务场景限定套系身份。此决定取代此前“暂不新增套系”的范围限制，保留现有五套的完善工作。
- 参考产品名称用于来源与理念说明，套系使用独立名称与稳定 ID，明确为项目自主实现。先研究具体平台、应用页面与版本，再定义字阶、布局、密度、组件结构、交互与动效；研究候选不注册为可用套系，不计入已交付数量。
- 2026-09-18 用户进一步澄清：直接沿现有套系机制扩展 Apple、ChatGPT、小米等完整组件套系，允许持续增加套系数量。同类按钮、输入、菜单、导航、弹窗等可以在每套中独立实现；不同套系可以覆盖相同业务，不要求每套发明独有场景，也不以至少两个场景作为新增门槛。优先交付完整、一致、可消费的组件语言，场景用于演示与验证。
- 桌面/移动、明暗与密度属于套内适配，按实际实现声明；不能把缩窄桌面页面当成移动语言。基础组件、业务组件与 patterns 分层，Agent 与外部项目沿现有 manifest、规范、API、消费校验路径使用。方向与验收见 docs/SUITE-PHILOSOPHIES.md。

- 2026-09-18 首批理念套系扩展：Orchard UI / 果序（orchard-ui、ou-、Orchard*）参考 Apple HIG 与 macOS 设置的分组和主从导航；Dialogue UI / 对谈（dialogue-ui、du-、Dialogue*）参考 ChatGPT 公开未登录界面与设置。来源日期与适配说明保存在 docs/design-references，第三方截图不分发。两套均为 experimental，浅色、舒适/紧凑密度，分别提供 20/21 个组件与 1 个页面组合；设置/对话只是验证组合，套系可覆盖其他业务。默认内存数据和示例回复不代表云端采用；同场景比较暂未支持并显式声明。
