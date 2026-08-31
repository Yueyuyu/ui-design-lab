---
version: alpha
name: Quiet Workspace
description: "A light-first, Windows-friendly editorial utility system for long-running desktop work. Warm paper surfaces, restrained sage accents, compact state tools, and explicit information hierarchy keep dense research and monitoring interfaces calm without becoming vague."
colors:
  canvas: "#FCFCFB"
  surface-strong: "#FFFFFF"
  surface-subtle: "#F1F3F0"
  surface-selected: "#E5E9E4"
  ink: "#262623"
  ink-secondary: "#686A65"
  ink-muted: "#73736E"
  border: "#E4E4E0"
  border-strong: "#D7D9D4"
  primary: "#2D5A55"
  primary-soft: "#DCE9E4"
  status-attention: "#E87D75"
  status-running: "#F0AD4E"
  status-success: "#4D8F65"
typography:
  display:
    fontFamily: "Segoe UI Variable, Segoe UI, Microsoft YaHei UI, system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48px
    letterSpacing: -0.8px
  heading:
    fontFamily: "Segoe UI Variable, Segoe UI, Microsoft YaHei UI, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: -0.2px
  title:
    fontFamily: "Segoe UI Variable, Segoe UI, Microsoft YaHei UI, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 650
    lineHeight: 24px
    letterSpacing: 0
  body:
    fontFamily: "Segoe UI Variable, Segoe UI, Microsoft YaHei UI, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: 0
  label:
    fontFamily: "Segoe UI Variable, Segoe UI, Microsoft YaHei UI, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 650
    lineHeight: 16px
    letterSpacing: 0.3px
  caption:
    fontFamily: "Segoe UI Variable, Segoe UI, Microsoft YaHei UI, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 0 16px
  button-secondary:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 0 16px
  field:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 0 12px
  card:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 20px
---

## Overview

Quiet Workspace serves research, monitoring, writing, data review, and other desktop tasks that stay open for long periods. It combines warm editorial reading surfaces with restrained utility controls. Hierarchy comes from typography, spacing, hairlines, and clear grouping before cards or decoration.

The system is scoped by `[data-ui-system="quiet-workspace"]`. All CSS custom properties start with `--qw-`, and reusable component classes start with `.qw-`. Gallery presentation scenery is not part of the product tokens.

## Colors

- Warm paper is the default product canvas; pure white is reserved for stronger surfaces.
- Deep sage is the primary interaction color. The lighter sage is used for charts and restrained emphasis.
- Red, amber, and green are semantic signals, not page decoration.
- Normal text must maintain at least 4.5:1 contrast against its declared surface.
- A scalar quota uses a very light tonal surface and low-saturation dark text from the same hue family.

## Typography

Use `Segoe UI Variable`, `Segoe UI`, and `Microsoft YaHei UI` before system fallbacks. English and numbers should feel native to Windows; Chinese should remain calm and readable.

Auxiliary text never goes below 11px. Control labels and critical compact information start at 12px. Default body copy is 14px with a relaxed 22px line height.

## Layout

The spacing system uses a 4px base. Comfortable density uses 40px controls, 52px rows, and 20px panel padding. Compact density uses 32px controls, 40px rows, and 12px panel padding. Density changes geometry and spacing, not critical text size.

Desktop tools use a stable navigation region, one primary content axis, and local status feedback. On narrow screens, secondary navigation collapses and content returns to one column.

## Elevation & Depth

Use spacing, paper surfaces, and 1px hairlines before shadows. Shadows are soft, local, and reserved for overlays or clearly lifted interactive surfaces. Dark gradients belong only to Gallery presentation scenes.

## Shapes

Controls use 8px radii, cards generally use 12px, and large presentation panels may use 16px. Pills are reserved for compact scalar values and genuine status carriers; they are not a universal decoration.

## Components

Every reusable component documents default, hover, pressed, focus, disabled, loading, and error states. Non-interactive containers express hover or pressed behavior through the controls or content they own.

Use existing exports from `systems/quiet-workspace/web/index.js` before creating a new component. The signature components are `QuietTaskLight` for concurrent task state and `QuietQuotaPill` for one continuous quota value.

## Do's and Don'ts

### Do

- Use the suite scope and `--qw-` tokens.
- Prefer content hierarchy over extra card containers.
- Keep interaction feedback between 140ms and 240ms with the suite easing curve.
- Pair error color with an icon, explicit copy, and a next action.
- Keep Chinese copy short, direct, and actionable.

### Don't

- Do not import tokens, components, patterns, or assets from another suite.
- Do not add a dark theme by recoloring the Gallery desktop backdrop.
- Do not introduce decorative gradients, 3D charts, continuous ambient animation, or 9px text.
- Do not use one status decoration for categorically different information.
- Do not replace system fonts with unavailable proprietary fonts.

## Responsive Behavior

The primary target is desktop web. Tablet layouts reduce grid columns and keep controls at usable sizes. Mobile layouts collapse navigation and content to one column. `QuietTaskLight` and `QuietQuotaPill` remain compact regardless of the outer Gallery density.

## Agent Usage

When the user requests suite `quiet-workspace`, read `suite.json`, this file, the foundation tokens, standards, and component exports. Treat `tokens.json` and the component implementation as canonical if prose and code ever differ. Wrap the implementation in `data-ui-system="quiet-workspace"`, use only `--qw-` tokens, and run the suite validation before handoff.
