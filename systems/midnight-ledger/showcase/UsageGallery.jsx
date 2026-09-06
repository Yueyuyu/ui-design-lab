import { CheckCircle, Copy, Package, TerminalWindow } from "@phosphor-icons/react";
import { copyText } from "../../../src/gallery/copyText.js";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";
import { suiteUsage } from "../../../src/gallery/usage-content.js";
import { LedgerButton, LedgerStatusBadge } from "../web/index.js";

const importExample = `import { LedgerButton, LedgerPanel, LedgerTable } from "ui-design-lab/midnight-ledger";\nimport "ui-design-lab/midnight-ledger/tokens.css";\nimport "ui-design-lab/midnight-ledger/components.css";\n\n<section data-ui-system="midnight-ledger" data-density="comfortable">\n  <LedgerButton>保存</LedgerButton>\n</section>;`;
async function copy(value, message, onNotify) {
  try {
    await copyText(value);
    onNotify?.(message);
  } catch {
    onNotify?.("复制失败，请手动选择文本");
  }
}
export function UsageGallery({ suite, onNotify }) { const { install, prompt } = suiteUsage(suite); return <><SectionHeader eyebrow="USAGE & AGENT HANDOFF" title="使用 Midnight Ledger" description="机器始终通过稳定 ID、作用域、Token 前缀和组件入口识别本套系统。" aside={<LedgerStatusBadge tone="warning" dot>{suite.status} · v{suite.version}</LedgerStatusBadge>} />
  <div className="ml-usage-summary"><article><Package size={20}/><strong>套系 ID</strong><code>midnight-ledger</code></article><article><TerminalWindow size={20}/><strong>CSS 作用域</strong><code>data-ui-system="midnight-ledger"</code></article><article><CheckCircle size={20}/><strong>Token 前缀</strong><code>--ml-*</code></article></div>
  <GalleryBlock eyebrow="INSTALL" title="安装到新项目" description="React 19.2+；当前使用本地 tgz 安装，未发布到 npm。"><div className="ml-usage-code"><pre><code>{install}</code></pre><LedgerButton variant="secondary" icon={Copy} onClick={() => copy(install,"安装步骤已复制",onNotify)}>复制安装步骤</LedgerButton></div></GalleryBlock>
  <GalleryBlock eyebrow="CODEX" title="复制给 Codex"><div className="ml-usage-code"><pre><code>{prompt}</code></pre><LedgerButton variant="secondary" icon={Copy} onClick={() => copy(prompt,"Codex 指令已复制",onNotify)}>复制 Codex 指令</LedgerButton></div></GalleryBlock>
  <GalleryBlock eyebrow="PACKAGE EXPORT" title="组件包入口" description="完整示例见 examples/consumer；组件参数与回调见 systems/midnight-ledger/API.md。"><div className="ml-usage-code"><pre><code>{importExample}</code></pre><LedgerButton variant="secondary" icon={Copy} onClick={() => copy(importExample,"导入示例已复制",onNotify)}>复制导入示例</LedgerButton></div></GalleryBlock></>;
}
