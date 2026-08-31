import { ArrowRight, Eye, ShieldCheck, Sparkle, Stack } from "@phosphor-icons/react";
import referenceImage from "../../../references/quiet-workspace-source.png";
import { QuietButton, QuietStatusChip } from "../web/index.js";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";

const principles = [
  {
    icon: Eye,
    title: "安静但不模糊",
    description: "低饱和表面承载长时间工作，关键状态保持明确。",
  },
  {
    icon: Stack,
    title: "内容先于容器",
    description: "依靠排版、间距和分组建立层级，减少无意义卡片。",
  },
  {
    icon: Sparkle,
    title: "状态载体匹配信息",
    description: "任务用点和轨道，单一额度用低饱和整块胶囊，不机械复用装饰。",
  },
  {
    icon: ShieldCheck,
    title: "稳定的短动效",
    description: "140–180ms 快速缓出，并完整支持减少动态效果。",
  },
];

export function OverviewGallery({ onNavigate }) {
  return (
    <>
      <SectionHeader
        eyebrow="SUITE 01 · QUIET WORKSPACE"
        title="静谧工作台"
        description="温润编辑感、克制效率工具和轻量桌面原生感组合而成的桌面产品设计系统。"
        aside={<QuietStatusChip tone="success" dot>v0.3 状态语义已建立</QuietStatusChip>}
      />

      <section className="overview-hero">
        <div className="overview-hero__copy">
          <span className="overview-hero__index">01</span>
          <p className="overview-hero__style">WARM EDITORIAL UTILITY</p>
          <h2>让复杂工具保持安静、清楚、可靠。</h2>
          <p>
            Quiet Workspace 面向研究、监控、写作和数据处理场景。它不靠强烈装饰制造品牌感，而是通过暖白表面、鼠尾草绿和严谨信息层级建立长期可用性。
          </p>
          <div className="overview-hero__actions">
            <QuietButton trailingIcon={ArrowRight} onClick={() => onNavigate("foundations")}>查看基础规范</QuietButton>
            <QuietButton variant="secondary" onClick={() => onNavigate("components")}>浏览组件</QuietButton>
          </div>
          <dl className="overview-hero__meta">
            <div><dt>字体</dt><dd>Segoe UI · 微软雅黑 UI</dd></div>
            <div><dt>基准</dt><dd>4px spacing grid</dd></div>
            <div><dt>模式</dt><dd>Light first</dd></div>
          </dl>
        </div>
        <figure className="overview-reference">
          <img src={referenceImage} alt="Quiet Workspace 原始视觉母版：白色工作台与 Codex 桌面任务灯" />
          <figcaption>
            <span><i />视觉母版</span>
            <span>1500 × 900</span>
          </figcaption>
        </figure>
      </section>

      <GalleryBlock
        eyebrow="DESIGN PRINCIPLES"
        title="四条不可破坏的原则"
        description="后续组件和页面必须同时满足这些原则。"
      >
        <div className="principle-grid">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <article className="principle-card" key={principle.title}>
                <span className="principle-card__number">0{index + 1}</span>
                <Icon size={21} aria-hidden="true" />
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            );
          })}
        </div>
      </GalleryBlock>
    </>
  );
}
