# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## UI Design Lab Decisions

- This repository contains multiple independent visual systems. Shared code may provide gallery/build tooling only; suites must not import another suite's tokens, components, patterns, or assets.
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
