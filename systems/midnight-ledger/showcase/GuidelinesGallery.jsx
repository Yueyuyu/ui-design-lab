import { ChartLine, CheckCircle, CursorClick, TextAa, WarningCircle } from "@phosphor-icons/react";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";
import { LedgerNotification, LedgerStatusBadge } from "../web/index.js";

const rules = [[TextAa, "数字必须带口径", "金额显示币种，收益显示正负号，时间说明交易阶段。"], [ChartLine, "方向不能只靠颜色", "红绿之外同时使用 +/−、文字和数值。"], [CursorClick, "高频控件反馈短", "120–180ms，禁止行情数字循环呼吸。"], [WarningCircle, "错误提供恢复动作", "先说明影响，再给重试、刷新或返回。"]];

export function GuidelinesGallery() { return <><SectionHeader eyebrow="CONTENT & BEHAVIOR" title="内容与行为" description="金融数据需要更严格的数字口径、风险语义和键盘操作规范。" aside={<LedgerStatusBadge tone="positive"><CheckCircle size={13} />4.5:1 contrast</LedgerStatusBadge>} />
  <GalleryBlock eyebrow="CORE RULES" title="行为原则"><div className="ml-guideline-grid">{rules.map(([Icon,title,copy],index) => <article key={title}><span>0{index+1}</span><Icon size={22} /><h3>{title}</h3><p>{copy}</p></article>)}</div></GalleryBlock>
  <GalleryBlock eyebrow="COPY" title="中文与数字文案"><div className="ml-copy-grid"><article><strong>推荐</strong><p>行情连接中断，新订单暂时无法提交。请重新连接。</p><p>NVDA 150C · 01/15 到期 · 剩 5 天</p></article><article data-bad="true"><strong>避免</strong><p>出错啦，请稍后再试。</p><p>这只期权快到期了。</p></article></div></GalleryBlock>
  <GalleryBlock eyebrow="STATUS" title="状态载体"><div className="ml-status-guide"><span><LedgerStatusBadge tone="positive">+4.52%</LedgerStatusBadge><small>收益和成功</small></span><span><LedgerStatusBadge tone="negative">-1.39%</LedgerStatusBadge><small>亏损和失败</small></span><span><LedgerStatusBadge tone="warning">剩 5 天</LedgerStatusBadge><small>临近阈值</small></span><span><LedgerStatusBadge tone="info">ETF</LedgerStatusBadge><small>信息分类</small></span><span><LedgerStatusBadge tone="option">期权</LedgerStatusBadge><small>资产分类</small></span></div></GalleryBlock>
  <GalleryBlock eyebrow="ERROR" title="完整错误反馈"><LedgerNotification error title="行情数据已过期" description="风险校验使用的是 14:28 快照，新订单没有提交。" actionLabel="刷新行情" /></GalleryBlock></>;
}
