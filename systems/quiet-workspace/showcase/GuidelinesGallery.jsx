import {
  ArrowRight,
  Bell,
  ChartBar,
  Check,
  CheckCircle,
  Copy,
  Gear,
  Info,
  Trash,
  WarningCircle,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import referenceImage from "../../../references/quiet-workspace-source.png";
import {
  QuietBarChart,
  QuietButton,
  QuietQuotaPill,
  QuietStatusChip,
  QuietTaskLight,
} from "../web/index.js";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";

const iconSamples = [
  { icon: Gear, label: "设置", name: "Gear" },
  { icon: Bell, label: "通知", name: "Bell" },
  { icon: Copy, label: "复制", name: "Copy" },
  { icon: ChartBar, label: "图表", name: "ChartBar" },
  { icon: Trash, label: "删除", name: "Trash" },
  { icon: X, label: "关闭", name: "X" },
];

const copyPairs = [
  {
    title: "按钮要说明动作",
    good: "重新加载数据",
    bad: "确定",
  },
  {
    title: "成功要说明结果",
    good: "规则已保存",
    bad: "操作成功",
  },
  {
    title: "错误要提供下一步",
    good: "工作区无法访问。请检查路径后重试。",
    bad: "路径非法",
  },
];

const chartData = [
  { label: "周一", value: 42 },
  { label: "周二", value: 58 },
  { label: "周三", value: 51 },
  { label: "周四", value: 73 },
  { label: "周五", value: 66 },
  { label: "周六", value: 84 },
];

export function GuidelinesGallery({ onNotify }) {
  const [motionKey, setMotionKey] = useState(0);

  return (
    <>
      <SectionHeader
        eyebrow="CONTENT & BEHAVIOR"
        title="内容与行为规范"
        description="统一图标、图表、中文文案、动效和展示场景边界，避免不同项目各自发明表达方式。"
        aside={<span className="foundation-count"><Check size={14} weight="bold" />6 项规范已建立</span>}
      />

      <GalleryBlock
        id="status-carriers"
        eyebrow="STATUS SEMANTICS"
        title="状态载体"
        description="视觉语言保持统一，但状态表达必须匹配信息类型；不要为了统一外观而机械复制圆点。"
      >
        <div className="status-carrier-grid">
          <article>
            <span className="status-carrier-grid__demo">
              <QuietStatusChip tone="running" dot>执行中 3</QuietStatusChip>
              <QuietStatusChip tone="attention" dot>需处理 1</QuietStatusChip>
            </span>
            <strong>多个并行分类状态</strong>
            <small>使用状态点或短轨道，并保留文字名称与数量。</small>
          </article>
          <article>
            <span className="status-carrier-grid__demo"><QuietQuotaPill remainingPercent={76} /></span>
            <strong>一个连续数值</strong>
            <small>使用整块低饱和表面和同色系深色数字，不再叠加圆点。</small>
          </article>
          <article>
            <span className="status-carrier-grid__feedback"><WarningCircle size={18} weight="bold" aria-hidden="true" />数据同步失败</span>
            <strong>离散结果或错误</strong>
            <small>同时使用图标、明确文案和下一步，不能只改变颜色。</small>
          </article>
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="ICONOGRAPHY" title="图标" description="统一使用 Phosphor Icons；默认 regular，小尺寸强调状态才使用 bold。">
        <div className="icon-guideline-layout">
          <div className="icon-sample-grid">
            {iconSamples.map((sample) => {
              const Icon = sample.icon;
              return (
                <article key={sample.name}>
                  <span><Icon size={18} aria-hidden="true" /></span>
                  <strong>{sample.label}</strong>
                  <code>{sample.name}</code>
                </article>
              );
            })}
          </div>
          <div className="icon-size-scale">
            {[16, 18, 20, 24].map((size) => (
              <span key={size}>
                <Info size={size} aria-hidden="true" />
                <strong>{size}px</strong>
                <small>{size === 16 ? "紧凑" : size === 18 ? "舒适" : size === 20 ? "导航" : "展示"}</small>
              </span>
            ))}
          </div>
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="DATA VISUALIZATION" title="数据图表" description="鼠尾草色阶表达普通数据，红、橙、绿只表达语义状态。">
        <div className="chart-guideline-layout">
          <QuietBarChart
            title="任务完成率"
            description="最近六天 · 单位%"
            unit="%"
            data={chartData}
          />
          <div className="guideline-rule-list">
            <article><CheckCircle size={18} weight="bold" aria-hidden="true" /><span><strong>保留数值与单位</strong><small>Hover、键盘聚焦和读屏都能获得精确值。</small></span></article>
            <article><CheckCircle size={18} weight="bold" aria-hidden="true" /><span><strong>颜色由浅到深</strong><small>同一序列只表达强度或时间推进。</small></span></article>
            <article><XCircle size={18} weight="bold" aria-hidden="true" /><span><strong>不用装饰性渐变</strong><small>不使用3D、面积阴影和持续动画。</small></span></article>
          </div>
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="CHINESE COPY" title="中文文案" description="短、直接、可执行；错误说明发生了什么以及下一步怎么做。">
        <div className="copy-guideline-grid">
          {copyPairs.map((pair) => (
            <article key={pair.title}>
              <h3>{pair.title}</h3>
              <p className="copy-example copy-example--good"><CheckCircle size={17} weight="bold" aria-hidden="true" /><span>{pair.good}</span></p>
              <p className="copy-example copy-example--bad"><XCircle size={17} weight="bold" aria-hidden="true" /><span>{pair.bad}</span></p>
            </article>
          ))}
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="MOTION" title="动效" description="140–240ms、最多4px位移、统一缓出；减少动态效果时取消位移和旋转。">
        <div className="motion-guideline-layout">
          <div className="motion-token-grid">
            <article><strong>Fast</strong><span>140ms</span><small>悬停、按下、开关</small></article>
            <article><strong>Normal</strong><span>180ms</span><small>菜单、通知、任务面板</small></article>
            <article><strong>Slow</strong><span>240ms</span><small>对话框与层级切换</small></article>
          </div>
          <div className="motion-live-demo">
            <div className="motion-live-demo__panel" key={motionKey}>
              <CheckCircle size={20} weight="bold" aria-hidden="true" />
              <span><strong>规则已保存</strong><small>位移4px · 180ms ease-out</small></span>
            </div>
            <QuietButton variant="secondary" trailingIcon={ArrowRight} onClick={() => {
              setMotionKey((value) => value + 1);
              onNotify?.("动效已重播");
            }}>重播动效</QuietButton>
          </div>
        </div>
      </GalleryBlock>

      <GalleryBlock
        eyebrow="GALLERY-ONLY SCENE"
        title="展示场景边界"
        description="深色渐变桌面背景只用于展示组件在真实桌面中的层级，不属于 Quiet Workspace 核心 Token。"
      >
        <div className="presentation-boundary" data-testid="presentation-boundary">
          <figure className="presentation-boundary__source">
            <img src={referenceImage} alt="Quiet Workspace 视觉母版" />
            <figcaption>视觉母版 · Source</figcaption>
          </figure>
          <section className="gallery-presentation-scene" aria-label="Gallery 展示场景中的任务灯">
            <span className="gallery-presentation-scene__label"><WarningCircle size={15} aria-hidden="true" />Gallery scene · 非核心 Token</span>
            <QuietTaskLight />
          </section>
        </div>
      </GalleryBlock>
    </>
  );
}
