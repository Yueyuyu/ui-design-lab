import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";
import { LedgerStatusBadge, LedgerTerminalPreview } from "../web/index.js";

export function PatternsGallery({ onNotify }) { return <><SectionHeader eyebrow="PAGE PATTERNS" title="页面模式" description="TradeGenius 两张母版与 CluesAI 现场页面分别成为总览、高频操作和信号驾驶舱模式，组件与 Token 完全共享。" aside={<LedgerStatusBadge tone="info">3 source-derived scenes</LedgerStatusBadge>} />
  <GalleryBlock eyebrow="PATTERN A" title="资产总览" description="奶油资产锚点、收益趋势、持仓和复盘数据在同一首屏完成判断。"><LedgerTerminalPreview onNotify={onNotify} /></GalleryBlock>
  <GalleryBlock eyebrow="PATTERN B" title="紧凑交易控制台" description="运行控制、账户曲线、持仓与建议流以更高密度并列，适合桌面操作。"><LedgerTerminalPreview mode="compact" onNotify={onNotify} /></GalleryBlock>
  <GalleryBlock eyebrow="PATTERN C · LIVE SOURCE" title="信号驾驶舱" description="固定侧栏、市场情绪、趋势矩阵、机会卡和跟踪表格来自真实 Cockpit 页面。"><LedgerTerminalPreview mode="cockpit" onNotify={onNotify} /></GalleryBlock>
  <GalleryBlock eyebrow="RESPONSIVE" title="响应式重排规则"><div className="ml-responsive-rules"><article><strong>Desktop · ≥1040</strong><span>4 轨道总览；持仓跨两行；主资产和曲线优先。</span></article><article><strong>Tablet · 701–1039</strong><span>2 轨道；持仓不再跨行；操作与图表并列。</span></article><article><strong>Mobile · ≤700</strong><span>单列；资产、主要操作、收益曲线、持仓依次出现。</span></article></div></GalleryBlock></>;
}
