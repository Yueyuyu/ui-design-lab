import { CheckCircle, Copy, Package, TerminalWindow } from "@phosphor-icons/react";
import { copyText } from "../../../src/gallery/copyText.js";
import { QuietButton, QuietStatusChip } from "../web/index.js";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";

const codexPrompt = `使用 UI Design Lab 的设计套系 quiet-workspace 实现当前页面。

开始前读取：
- systems/quiet-workspace/suite.json
- systems/quiet-workspace/DESIGN.md
- systems/quiet-workspace/foundations/
- systems/quiet-workspace/standards/
- systems/quiet-workspace/web/index.js

必须使用 data-ui-system="quiet-workspace"、--qw-* Token 和现有 Quiet Workspace 组件。禁止混入其他套系。完成后运行 npm run suite:check。`;

const importExample = `import {
  QuietButton,
  QuietStatusChip
} from "./systems/quiet-workspace/web/index.js";
import "./systems/quiet-workspace/foundations/tokens.css";
import "./systems/quiet-workspace/web/components.css";`;

async function copyUsageText(value, message, onNotify) {
  try {
    await copyText(value);
    onNotify?.(message);
  } catch {
    onNotify?.("复制失败，请手动选择文本");
  }
}

export function UsageGallery({ onNotify }) {
  return (
    <>
      <SectionHeader
        eyebrow="USAGE & AGENT HANDOFF"
        title="使用 Quiet Workspace"
        description="套系 ID 是稳定入口；编号只用于展示，不能代替机器标识。"
        aside={<QuietStatusChip tone="success" dot>Stable · v0.3.0</QuietStatusChip>}
      />

      <div className="usage-summary-grid">
        <article><Package size={21} aria-hidden="true" /><strong>套系 ID</strong><code>quiet-workspace</code></article>
        <article><TerminalWindow size={21} aria-hidden="true" /><strong>CSS 作用域</strong><code>data-ui-system="quiet-workspace"</code></article>
        <article><CheckCircle size={21} aria-hidden="true" /><strong>Token 前缀</strong><code>--qw-*</code></article>
      </div>

      <GalleryBlock eyebrow="CODEX" title="复制给 Codex" description="这段指令让 Codex 先解析套系合同，再实现页面。">
        <div className="usage-code-block">
          <pre><code>{codexPrompt}</code></pre>
          <QuietButton variant="secondary" icon={Copy} onClick={() => copyUsageText(codexPrompt, "Codex 指令已复制", onNotify)}>复制 Codex 指令</QuietButton>
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="IMPORT" title="直接复用组件" description="当前阶段通过仓库路径复用；稳定包入口将在 v1.0.0 建立。">
        <div className="usage-code-block">
          <pre><code>{importExample}</code></pre>
          <QuietButton variant="secondary" icon={Copy} onClick={() => copyUsageText(importExample, "导入示例已复制", onNotify)}>复制导入示例</QuietButton>
        </div>
      </GalleryBlock>
    </>
  );
}
