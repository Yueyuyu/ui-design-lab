import {ArrowRight, ArrowUpRight, BookOpen, Cube, Play} from '@phosphor-icons/react';
import {kits} from './kits.js';
import {recordEvent} from './telemetry.js';
import './suite-examples.css';

const previews = import.meta.glob('./kit-previews/*.png', {eager:true, query:'?url', import:'default'});

export function SuiteExamples({suite, patternEntries = []}) {
  const examples = kits.filter(kit => kit.preferred === suite.id);
  const base = `#/systems/${suite.id}`;
  return <section className="suite-examples public-design-context">
    <header className="suite-examples-heading">
      <span>{suite.localizedName}</span>
      <h1>应用示例</h1>
      <p>看看这套设计语言，如何用在真实的页面里。</p>
    </header>
    {examples.length ? <div className="suite-examples-grid" data-single={examples.length === 1}>
      {examples.map(kit => <article className="suite-example" key={kit.id} data-kit-id={kit.id}>
        <a className="suite-example-preview" href={`#/scenes/${kit.id}`} aria-label={`预览${kit.title}`} onClick={() => recordEvent('kit_view', {kitId:kit.id})}>
          <img src={previews[`./kit-previews/${kit.id}.png`]} alt={`${kit.title}的可操作页面截图，首屏区域`} loading="lazy"/>
          <span><Play size={16} weight="fill" aria-hidden="true"/>打开交互示例</span>
        </a>
        <div className="suite-example-body">
          <span className="suite-example-label">可交互 · 示例数据</span>
          <h2>{kit.title}</h2>
          <p>{kit.purpose}</p>
          <ul aria-label="可以体验的操作">{kit.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
          <a className="example-primary-link" href={`#/scenes/${kit.id}`}>体验示例<ArrowUpRight size={18} aria-hidden="true"/></a>
          <a className="example-project-link" href={`#/usage?suite=${suite.id}&kit=${kit.id}`}>用于我的项目<ArrowRight size={16} aria-hidden="true"/></a>
        </div>
      </article>)}
    </div> : <div className="suite-examples-empty">
      <Cube size={32} aria-hidden="true"/><h2>独立应用示例开发中</h2>
      <p>目前可在交互试验中查看本套组件的表现与状态。</p>
      <a className="example-primary-link" href={`${base}/playground`}>查看交互试验<ArrowRight size={18} aria-hidden="true"/></a>
    </div>}
    <aside className="suite-examples-next">
      <div><h2>从示例出发，设计自己的产品</h2><p>示例展示一种用法。把本套的配色、排版、布局与交互规则交给 Codex，也能继续设计你的页面和新组件。</p></div>
      <nav aria-label="继续了解本套设计语言">
        <a href={`${base}/guidelines/extension`}><BookOpen size={19} aria-hidden="true"/>查看设计规则<ArrowRight size={17} aria-hidden="true"/></a>
        <a href={`${base}/components`}><Cube size={19} aria-hidden="true"/>查看组成组件<ArrowRight size={17} aria-hidden="true"/></a>
      </nav>
    </aside>
    {patternEntries.length > 0 && <details className="suite-example-docs"><summary>页面组合文档</summary><p>查看页面组合的接口、源码和使用边界。</p><nav aria-label="页面组合文档">{patternEntries.map(entry => <a key={entry.id} href={`${base}/patterns/${entry.id}`}>{entry.title}<ArrowRight size={16} aria-hidden="true"/></a>)}</nav></details>}
  </section>;
}
