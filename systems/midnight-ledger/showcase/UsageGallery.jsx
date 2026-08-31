import { CheckCircle, Copy, Package, TerminalWindow } from "@phosphor-icons/react";
import { copyText } from "../../../src/gallery/copyText.js";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";
import { LedgerButton, LedgerStatusBadge } from "../web/index.js";

const codexPrompt = `使用 UI Design Lab 的设计套系 midnight-ledger 实现当前页面。\n\n开始前读取：\n- systems/midnight-ledger/suite.json\n- systems/midnight-ledger/DESIGN.md\n- systems/midnight-ledger/foundations/\n- systems/midnight-ledger/standards/\n- systems/midnight-ledger/web/index.js\n\n必须使用 data-ui-system="midnight-ledger"、--ml-* Token 和现有 Ledger* 组件。禁止混入其他套系。完成后运行 npm run suite:check。`;
const importExample = `import { LedgerButton, LedgerPanel, LedgerTable } from "ui-design-lab/midnight-ledger";\nimport "ui-design-lab/midnight-ledger/tokens.css";\nimport "ui-design-lab/midnight-ledger/components.css";`;
async function copy(value, message, onNotify) {
  try {
    await copyText(value);
    onNotify?.(message);
  } catch {
    onNotify?.("复制失败，请手动选择文本");
  }
}
export function UsageGallery({ onNotify }) { return <><SectionHeader eyebrow="USAGE & AGENT HANDOFF" title="使用 Midnight Ledger" description="机器始终通过稳定 ID、作用域、Token 前缀和组件入口识别本套系统。" aside={<LedgerStatusBadge tone="warning" dot>Experimental · v0.1.0</LedgerStatusBadge>} />
  <div className="ml-usage-summary"><article><Package size={20}/><strong>套系 ID</strong><code>midnight-ledger</code></article><article><TerminalWindow size={20}/><strong>CSS 作用域</strong><code>data-ui-system="midnight-ledger"</code></article><article><CheckCircle size={20}/><strong>Token 前缀</strong><code>--ml-*</code></article></div>
  <GalleryBlock eyebrow="CODEX" title="复制给 Codex"><div className="ml-usage-code"><pre><code>{codexPrompt}</code></pre><LedgerButton variant="secondary" icon={Copy} onClick={() => copy(codexPrompt,"Codex 指令已复制",onNotify)}>复制 Codex 指令</LedgerButton></div></GalleryBlock>
  <GalleryBlock eyebrow="PACKAGE EXPORT" title="稳定复用入口"><div className="ml-usage-code"><pre><code>{importExample}</code></pre><LedgerButton variant="secondary" icon={Copy} onClick={() => copy(importExample,"导入示例已复制",onNotify)}>复制导入示例</LedgerButton></div></GalleryBlock></>;
}
