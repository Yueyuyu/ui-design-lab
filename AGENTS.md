# Prototype Instructions

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
