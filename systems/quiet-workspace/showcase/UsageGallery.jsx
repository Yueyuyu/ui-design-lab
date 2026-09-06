import { CheckCircle, Copy, Package, TerminalWindow } from "@phosphor-icons/react";
import { copyText } from "../../../src/gallery/copyText.js";
import { QuietButton, QuietStatusChip } from "../web/index.js";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";
import { suiteUsage } from "../../../src/gallery/usage-content.js";

const importExample = `import {
  QuietButton,
  QuietStatusChip
} from "ui-design-lab/quiet-workspace";
import "ui-design-lab/quiet-workspace/tokens.css";
import "ui-design-lab/quiet-workspace/components.css";

<section data-ui-system="quiet-workspace" data-density="comfortable">
  <QuietButton onClick={() => console.log("已点击")}>保存</QuietButton>
</section>;`;

async function copyUsageText(value, message, onNotify) {
  try {
    await copyText(value);
    onNotify?.(message);
  } catch {
    onNotify?.("复制失败，请手动选择文本");
  }
}

export function UsageGallery({ suite, onNotify }) {
  const { install, prompt } = suiteUsage(suite);
  return (
    <>
      <SectionHeader
        eyebrow="USAGE & AGENT HANDOFF"
        title="使用 Quiet Workspace"
        description="套系 ID 是稳定入口；编号只用于展示，不能代替机器标识。"
        aside={<QuietStatusChip tone="success" dot>{suite.status} · v{suite.version}</QuietStatusChip>}
      />

      <div className="usage-summary-grid">
        <article><Package size={21} aria-hidden="true" /><strong>套系 ID</strong><code>quiet-workspace</code></article>
        <article><TerminalWindow size={21} aria-hidden="true" /><strong>CSS 作用域</strong><code>data-ui-system="quiet-workspace"</code></article>
        <article><CheckCircle size={21} aria-hidden="true" /><strong>Token 前缀</strong><code>--qw-*</code></article>
      </div>

      <GalleryBlock eyebrow="INSTALL" title="安装到新项目" description="React 19.2+；先构建并打包，再在消费项目安装生成的 tgz。当前未发布到 npm。">
        <div className="usage-code-block"><pre><code>{install}</code></pre><QuietButton variant="secondary" icon={Copy} onClick={() => copyUsageText(install, "安装步骤已复制", onNotify)}>复制安装步骤</QuietButton></div>
      </GalleryBlock>
      <GalleryBlock eyebrow="CODEX" title="复制给 Codex" description="指令包含仓库和已安装包两种目录位置。">
        <div className="usage-code-block">
          <pre><code>{prompt}</code></pre>
          <QuietButton variant="secondary" icon={Copy} onClick={() => copyUsageText(prompt, "Codex 指令已复制", onNotify)}>复制 Codex 指令</QuietButton>
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="IMPORT" title="直接复用组件" description="完整可运行项目位于 examples/consumer；组件参数、回调和状态见 systems/quiet-workspace/API.md。">
        <div className="usage-code-block">
          <pre><code>{importExample}</code></pre>
          <QuietButton variant="secondary" icon={Copy} onClick={() => copyUsageText(importExample, "导入示例已复制", onNotify)}>复制导入示例</QuietButton>
        </div>
      </GalleryBlock>
    </>
  );
}
