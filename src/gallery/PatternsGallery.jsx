import { ArrowsOut, CheckCircle, Compass, WarningCircle } from "@phosphor-icons/react";
import { QuietStatusChip, QuietTaskLight, QuietWorkspacePreview } from "../../systems/quiet-workspace/web/index.js";
import { GalleryBlock, SectionHeader } from "./SectionHeader.jsx";

const patternRules = [
  { icon: Compass, title: "固定结构", copy: "左侧导航、单一内容主轴、稳定的顶部上下文。" },
  { icon: ArrowsOut, title: "响应式收敛", copy: "窄屏隐藏次级导航，内容和卡片回到单列。" },
  { icon: WarningCircle, title: "状态就地表达", copy: "状态贴近任务对象，不依赖全局颜色铺满页面。" },
  { icon: CheckCircle, title: "完成后安静", copy: "没有待办时回归中性界面，不持续争夺注意力。" },
];

export function PatternsGallery() {
  return (
    <>
      <SectionHeader
        eyebrow="PATTERNS"
        title="页面模式"
        description="把基础 Token 和组件组合成可以直接复用的工作台与浮动工具模式。"
        aside={<QuietStatusChip tone="neutral">Desktop first</QuietStatusChip>}
      />

      <GalleryBlock eyebrow="WORKSPACE SHELL" title="研究与复盘工作台" description="母版中的主体页面模式，适合研究、数据、写作和监控产品。">
        <QuietWorkspacePreview />
      </GalleryBlock>

      <GalleryBlock eyebrow="FLOATING UTILITY" title="浮动状态工具" description="与主工作区保持视觉一致，但具有独立层级和紧凑密度。">
        <div className="floating-utility-pattern">
          <div className="floating-utility-pattern__copy">
            <span>01</span>
            <h3>状态只在需要时提高存在感</h3>
            <p>收起时显示最少必要信息，展开后再提供任务标题、时间和控制项。</p>
          </div>
          <QuietTaskLight />
        </div>
      </GalleryBlock>

      <div className="pattern-rule-grid">
        {patternRules.map((rule) => {
          const Icon = rule.icon;
          return (
            <article key={rule.title}>
              <Icon size={20} aria-hidden="true" />
              <h3>{rule.title}</h3>
              <p>{rule.copy}</p>
            </article>
          );
        })}
      </div>
    </>
  );
}
