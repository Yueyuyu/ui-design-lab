import { recordEvent } from "../telemetry.js";
import {
  ArrowSquareOut,
  CheckCircle,
  Copy,
  Palette,
  PenNib,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { copyText } from "../copyText.js";
import { ComparisonSuiteStatus } from "./SuiteSceneRenderer.jsx";
import { getStateLabel, getSuiteFeatureLabels, getSuiteMarkColor } from "./scenarios.js";

const featureIcons = [Palette, SlidersHorizontal, PenNib];

export function SelectionInspector({ suite, scenario, density, visualState, prompt, onNotify, onEnterSuite }) {
  const features = getSuiteFeatureLabels(suite, density);

  const copyInstruction = async () => {
    try {
      await copyText(prompt); recordEvent("instruction_copy");
      onNotify(`${suite.displayName} 套系指令已复制`);
    } catch {
      onNotify("复制失败，请手动复制指令预览");
    }
  };

  return (
    <aside className="comparison-inspector">
      <h2>当前选择</h2>
      <div className="comparison-inspector__body">
        <section>
          <small>当前套系</small>
          <div className="comparison-inspector__suite">
            <i style={{ background: getSuiteMarkColor(suite) }}>{suite.shortCode}</i>
            <strong>{suite.displayName}</strong>
            <span data-ui-system={suite.id}><ComparisonSuiteStatus suite={suite} /></span>
          </div>
        </section>

        <section>
          <small>套系特征</small>
          <ul className="comparison-inspector__features">
            {features.map((feature, index) => {
              const Icon = featureIcons[index] ?? Palette;
              return <li key={feature}><Icon size={15} aria-hidden="true" />{feature}</li>;
            })}
          </ul>
        </section>

        <section>
          <small>场景与状态</small>
          <dl className="comparison-inspector__context">
            <div><dt>场景</dt><dd>{scenario.label}</dd></div>
            <div><dt>状态</dt><dd>{getStateLabel(visualState)}</dd></div>
          </dl>
        </section>

        <section>
          <small>数据一致性</small>
          <p className="comparison-inspector__consistency"><CheckCircle size={16} weight="fill" aria-hidden="true" />与另一套系保持一致</p>
        </section>

        <section className="comparison-inspector__actions">
          <small>操作</small>
          <button type="button" className="comparison-inspector__copy" onClick={copyInstruction}><Copy size={16} aria-hidden="true" />复制 {suite.displayName} 指令</button>
          <button type="button" className="comparison-inspector__enter" onClick={() => onEnterSuite(suite.id)}>进入套系 <ArrowSquareOut size={15} aria-hidden="true" /></button>
        </section>

        <section className="comparison-inspector__prompt">
          <small>Codex 指令预览</small>
          <pre>{prompt}</pre>
          <button type="button" onClick={copyInstruction}><Copy size={14} aria-hidden="true" />复制全部</button>
        </section>

        <p className="comparison-inspector__footnote">复制的指令可用于 Codex 执行或再次渲染。</p>
      </div>
    </aside>
  );
}
