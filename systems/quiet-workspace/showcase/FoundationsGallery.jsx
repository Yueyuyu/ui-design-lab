import { Check, Copy, Eye, TextT } from "@phosphor-icons/react";
import { QuietButton, QuietField } from "../web/index.js";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";

const colors = [
  { name: "Paper", token: "--qw-color-paper", value: "#FCFCFB", role: "主内容底色" },
  { name: "Ink", token: "--qw-color-text-primary", value: "#262623", role: "主文字" },
  { name: "Deep Sage", token: "--qw-color-brand-deep", value: "#2D5A55", role: "品牌与主操作" },
  { name: "Sage", token: "--qw-color-brand", value: "#477D71", role: "图表与强调" },
  { name: "Attention", token: "--qw-color-attention", value: "#E87D75", role: "需处理" },
  { name: "Running", token: "--qw-color-running", value: "#F0AD4E", role: "执行中" },
  { name: "Success", token: "--qw-color-success", value: "#4D8F65", role: "完成与开启" },
  { name: "Hairline", token: "--qw-color-border", value: "#E4E4E0", role: "边线" },
];

const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48];
const radii = [
  { label: "SM", value: 4 },
  { label: "MD", value: 8 },
  { label: "LG", value: 12 },
  { label: "XL", value: 16 },
];

function copyToken(token, onNotify) {
  navigator.clipboard?.writeText(token);
  onNotify?.(`已复制 ${token}`);
}

export function FoundationsGallery({ onNotify }) {
  return (
    <>
      <SectionHeader
        eyebrow="FOUNDATIONS"
        title="基础规范"
        description="颜色、字体、间距、圆角与动效使用固定等级，任何组件都不自行创造近似值。"
        aside={<span className="foundation-count"><Check size={14} weight="bold" />可访问性校验已启用</span>}
      />

      <GalleryBlock eyebrow="COLOR" title="语义色板" description="状态色不进入页面级大面积背景；单一状态的小型组件可使用极浅语义表面，并配同色系深色文字。">
        <div className="color-token-grid">
          {colors.map((color) => (
            <button className="color-token" type="button" key={color.token} onClick={() => copyToken(color.token, onNotify)}>
              <span className="color-token__swatch" style={{ backgroundColor: color.value }} />
              <span className="color-token__copy">
                <strong>{color.name}</strong>
                <small>{color.role}</small>
                <code>{color.value}</code>
              </span>
              <Copy size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="ACCESSIBILITY" title="可读性底线" description="不再使用9px辅助文字；普通文字对比度至少4.5:1，错误同时使用图标和说明。">
        <div className="accessibility-rule-grid">
          <article><Eye size={20} aria-hidden="true" /><strong>11px</strong><span>辅助文字最小字号</span></article>
          <article><Eye size={20} aria-hidden="true" /><strong>12px</strong><span>控件与关键紧凑信息</span></article>
          <article><Eye size={20} aria-hidden="true" /><strong>4.5:1</strong><span>普通文字最低对比度</span></article>
          <article><Eye size={20} aria-hidden="true" /><strong>3px</strong><span>统一键盘焦点外环</span></article>
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="TYPOGRAPHY" title="中英文混排" description="英文和数字由 Segoe UI 主导，中文回退到 Microsoft YaHei UI。">
        <div className="type-specimen">
          <div className="type-specimen__hero">
            <TextT size={24} aria-hidden="true" />
            <span>Segoe UI Variable · Microsoft YaHei UI</span>
            <strong>安静的工具，也可以很有力量。</strong>
            <p>Quiet tools can still feel decisive. 0123456789</p>
          </div>
          <div className="type-scale">
            <div><span>Display · 40/48 · 700</span><strong className="type-display">本周产品进展</strong></div>
            <div><span>Heading · 24/32 · 700</span><strong className="type-heading">任务与数据状态</strong></div>
            <div><span>Body · 14/24 · 400</span><p className="type-body">正文保持轻松的行高，适合长时间阅读和处理复杂信息。</p></div>
            <div><span>Label · 12/16 · 650</span><strong className="type-label">WEEKLY REVIEW · 08 / 19</strong></div>
          </div>
        </div>
      </GalleryBlock>

      <div className="foundation-split">
        <GalleryBlock eyebrow="SPACING" title="4px 间距基准">
          <div className="spacing-scale">
            {spacing.map((value) => (
              <div key={value}>
                <span>{value}</span>
                <i style={{ width: `${value * 2}px` }} />
                <code>--qw-space-{value / 4}</code>
              </div>
            ))}
          </div>
        </GalleryBlock>

        <GalleryBlock eyebrow="SHAPE & MOTION" title="圆角与反馈">
          <div className="radius-scale">
            {radii.map((radius) => (
              <div key={radius.label}>
                <i style={{ borderRadius: `${radius.value}px` }} />
                <span>{radius.label}<small>{radius.value}px</small></span>
              </div>
            ))}
          </div>
          <div className="motion-spec">
            <span><i />140ms · fast</span>
            <span><i />180ms · normal</span>
            <code>cubic-bezier(0.23, 1, 0.32, 1)</code>
          </div>
        </GalleryBlock>
      </div>

      <GalleryBlock eyebrow="DENSITY" title="舒适与紧凑" description="密度只改变高度、行高、内边距和间距；关键文字字号保持不变。任务灯固定属于紧凑模式。">
        <div className="density-comparison">
          <section data-density="comfortable">
            <header><strong>舒适密度</strong><span>40px 控件 · 52px 行高 · 20px 面板内边距</span></header>
            <QuietField label="项目名称" defaultValue="产品研究工作台" hint="适合常规页面与长时间工作" />
            <QuietButton>保存设置</QuietButton>
          </section>
          <section data-density="compact">
            <header><strong>紧凑密度</strong><span>32px 控件 · 40px 行高 · 12px 面板内边距</span></header>
            <QuietField label="项目名称" defaultValue="产品研究工作台" hint="适合浮层、监控列表和任务灯" />
            <QuietButton>保存设置</QuietButton>
          </section>
        </div>
      </GalleryBlock>
    </>
  );
}
