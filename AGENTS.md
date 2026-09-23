# Prototype Instructions

- 2026-09-23 Pulse 胶囊拖动：整个侧轨可抓取，超过 6px 阈值才启动拖动，小移动仍点击；拖动后隔离 click。自动贴边默认关闭，可开关；Windows 由宿主持久化。只防整个侧轨移出工作区，保留可抓取边缘，展开详情不能挪动侧轨。Lab 仅演示，不连接本机设置；不更改 Pulse 视觉或 Quiet Workspace。

- 2026-09-22 额度授权：Companion 按本机接口/有效缓存→对应桌面登录→手动备用网页登录读取，默认不要求重复登录。共享 UI 显示受控来源、停止读取和恢复按钮；停止偏好由宿主持久化，页面不接收令牌、Cookie 或凭据路径。Lab 保持固定示例，不接账户。Pulse 造型/动效不因授权流程改画。

- 2026-09-21 应用显隐：真实 Companion 只传入已打开的桌面应用；关闭即隐藏对应图标，全部关闭为空列表，不能自动补出 Codex 或示例。选中应用被移除时切换到仍存在的首项；该应用重新加入不抢回选择。登录与图标偏好由宿主保留。Lab 示例不读取真实进程。

- 2026-09-21 桌面悬停稳定性：Companion renderer 使用固定宽度及预留高度的透明画布，使圆环在展开/收起时位置不变，避免 WebView 与宿主两次位移产生残影。此为 Windows 专用承载修正，不改变 Lab 侧轨造型与 320ms 收起约定；透明预留区必须排除原生鼠标命中。

- 2026-09-21 后台与应用分项：桌面 Companion 获准迁移为登录后台自启、随 Codex 运行显隐；每个真实已接入应用独立一项，品牌图标/机器人选择按应用保存。Lab 仅演示多应用，不把示例当成 Cursor 已接入；沿用 Pulse 视觉，旧安装保留可回退。

- 2026-09-21 Pulse 收起反馈：点击展开不等于固定。未固定时移出 320ms、点击外部、失去窗口焦点或打开任务后收起；只有显式固定才常驻。快速跨过轨道/面板间隙可取消收起，贴边来源退回贴边，键盘操作不因静止鼠标在外而关闭。

- 2026-09-21 最新接入决定：Companion 桌面宿主获准连接真实只读业务；Lab Gallery/Playground 始终使用示例，不建立账户或本机业务通道。共享组件通过受控 props 接收额度与任务各自的读取状态、重置文案及来源标签；实时桌面不允许回落到 69% 或示例任务。

- 2026-09-21 直接复用实施：Pulse 原版黑色配色优先于早期白色草稿；采用 64px 侧轨、环下百分比、现成 OpenAI SVG / Bot 资源及上游人格编排。Windows 使用 WebView2 共享 renderer，不再二次自绘。允许原版 hover 预览（320ms 离开宽限），同时保留点击、固定、键盘。机器人第三方授权未解决，仅放 gitignored .local-cache，不纳入公开 build/push。真实业务接入与替换旧安装仍待视觉确认。

- 2026-09-21 最新纠正：用户要求直接复用 Pulse 已有完整设计，而非重新设计机器人或另造“小搭子”。“独立套件”指目录/Token/发布边界独立，不代表必须原创视觉。优先保留上游造型、颜色、比例与动效，通过适配器保留 Companion 业务；仅因平台差异移植渲染，不自行改画。先前自绘机器人只是未获认可的草稿，不作为下一阶段的视觉基准。沿用静态开关、低动态偏好与卸载清理；Quiet Workspace 与正式 Companion 不变。上游复用的来源、许可证及尚未解决的机器人素材权利见 systems/pulse-desktop/UPSTREAM.md；不能把 Pulse 根 Apache-2.0 许可证宣称为覆盖全部第三方素材。

- 2026-09-21 用户明确授权新增独立 Pulse-inspired 桌面设计验证套件：`pulse-desktop` / 脉点桌面，`pd-` / `Pulse*`，当前 draft。先验证紧凑、展开、贴边三状态及真实 Windows 窗口，不覆盖 Quiet Workspace，不替换 Companion 正式组件。白色实体表面，额度与任务语义分离，点击而非悬停展开；关注完成项保留。示例数据必须持续标注；背景仅属 Gallery。真实桌面、多缩放验收与用户视觉确认后，再接现有只读业务能力。不得把本轮原型宣布为已安装或新正式版本。

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## UI Design Lab Decisions

- UI Design Lab has two product layers: a neutral public discovery homepage and a suite-owned interior. The homepage must not inherit any suite tokens; after entry, the sidebar, top bar, controls, and workspace shell all adapt to the active suite.
- The homepage highlights at most two featured suites above the fold. Additional registered suites appear in a searchable directory, so growth never turns the first viewport into an unbounded card wall.
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

- Homepage selection metadata (maturity, suitable tasks, limitations, reference thumbnail) belongs in suite.json. The directory searches every suite, including featured entries; mobile retains public navigation and the suite directory entry.
- Comparison renderers live in each suite's comparison/index.jsx and are loaded by the registry. Exported Codex instructions carry a scene-specific JSON snapshot, preserving edited values and false settings.
- Dialogs use suite-local Portal/native modal implementations with focus containment, background scroll locking, and focus restoration. Loading/disabled content is inert while the close control remains available.
- Token changes update foundations/token-bindings.json and must pass bidirectional JSON/CSS checks. Component distribution is a local ESM tarball with types; third-party references are excluded and remain governed by NOTICE.md.

- 首页所有套系的宣传封面采用一致的展示规范，统一尺寸比例、构图方式、裁切规则，以及卡片标题、说明和元数据的字体层级；新增套系同样遵循，不能每套自行设计一张不相干的宣传图。
- 首页套系展示应更紧凑，避免大幅封面挤占首屏，并适应后续套系数量增长。先统一公共展示规范，再扩展套系；套系内部仍保留各自的视觉语言。

- 用户已授权完整路线初步实施，常规实现与选稿由代理自主完成。新增 Clearline Console / 澄明后台（clearline-console，cc-，Clear*）采用白色表格与侧向详情；Signal Studio / 信号创作间（signal-studio，ss-，Signal*）采用横向导航、衬线标题与原创内容封面。两者仅浅色，不把主题改色计为新套系。选定来源分别为 references/clearline-console-source.png、references/signal-studio-source.png。
