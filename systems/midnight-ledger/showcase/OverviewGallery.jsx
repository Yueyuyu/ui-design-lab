import { ArrowRight, ChartLineUp, GridFour, MoonStars, ShieldCheck } from "@phosphor-icons/react";
import primaryReference from "../../../references/midnight-ledger-source.png";
import compactReference from "../../../references/midnight-ledger-compact-source.png";
import liveReference from "../../../references/midnight-ledger-live-source.png";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";
import { LedgerButton, LedgerStatusBadge, LedgerTerminalPreview } from "../web/index.js";

const principles = [
  [MoonStars, "夜间而非纯黑", "深蓝色阶支撑长时间使用，奶油色负责最高层级反转。"],
  [GridFour, "高密度但有秩序", "连续表格和不等宽网格组织复杂数据，不把每项做成卡片。"],
  [ChartLineUp, "方向语义明确", "正负号、文字与颜色共同表达收益方向。"],
  [ShieldCheck, "风险先于装饰", "错误说明影响与恢复动作，动效不干扰行情读取。"]
];

export function OverviewGallery({ onNavigate, onNotify }) {
  return <><SectionHeader eyebrow="SUITE 02 · MIDNIGHT LEDGER" title="午夜账盘" description="由两张 TradeGenius 母版与 CluesAI 现场驾驶舱共同拆解出的深色金融终端设计系统。" aside={<LedgerStatusBadge tone="warning" dot>Experimental · v0.1</LedgerStatusBadge>} />
    <section className="ml-overview-hero"><div><span>02</span><p>NOCTURNAL FINANCIAL CONSOLE</p><h2>让高密度数据保持克制、快速、可判断。</h2><p>Midnight Ledger 用深蓝账盘承载连续信息，以奶油资产面板建立视觉锚点，再让橙色交易操作、绿色收益和珊瑚红风险各司其职。</p><div><LedgerButton trailingIcon={ArrowRight} onClick={() => onNavigate("foundations")}>查看基础规范</LedgerButton><LedgerButton variant="secondary" onClick={() => onNavigate("patterns")}>浏览页面模式</LedgerButton></div><dl><div><dt>模式</dt><dd>Dark first</dd></div><div><dt>密度</dt><dd>Compact native</dd></div><div><dt>基准</dt><dd>4px grid</dd></div></dl></div><figure><img src={primaryReference} alt="Midnight Ledger 主视觉母版" /><figcaption>主母版 · 资产总览与持仓分析</figcaption></figure></section>
    <GalleryBlock eyebrow="LIVE SYSTEM" title="可操作终端预览" description="周期、持仓行、入金和出金均可交互；切换 Gallery 预览尺寸可检查响应式重排。"><LedgerTerminalPreview onNotify={onNotify} /></GalleryBlock>
    <GalleryBlock eyebrow="THREE SOURCES · ONE SYSTEM" title="视觉来源边界"><div className="ml-reference-pair"><figure><img src={primaryReference} alt="资产总览母版" /><figcaption><strong>总览母版</strong><span>资产、收益、持仓、日历、敞口和策略图表。</span></figcaption></figure><figure><img src={compactReference} alt="紧凑交易母版" /><figcaption><strong>紧凑母版</strong><span>运行控制、计划表单、建议流、持仓表与日志。</span></figcaption></figure><figure><img src={liveReference} alt="CluesAI 现场驾驶舱" /><figcaption><strong>现场驾驶舱</strong><span>固定侧栏、市场情绪、趋势矩阵、机会卡与跟踪表格。</span></figcaption></figure></div></GalleryBlock>
    <GalleryBlock eyebrow="PRINCIPLES" title="四条设计原则"><div className="ml-principle-grid">{principles.map(([Icon, title, copy], index) => <article key={title}><span>0{index + 1}</span><Icon size={22} /><h3>{title}</h3><p>{copy}</p></article>)}</div></GalleryBlock></>;
}
