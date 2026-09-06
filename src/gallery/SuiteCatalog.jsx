import { recordEvent } from "./telemetry.js";
import { SuiteCover } from "./SuiteCover.jsx";
import {
  ArrowRight,
  ArrowsLeftRight,
  BookOpen,
  Code,
  MagnifyingGlass,
  Stack
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { filterSuites, suiteStatusLabels } from "./catalog-data.js";

function suiteModeLabel(suite) {
  if (suite.modes.includes("light") && !suite.modes.includes("dark")) {
    return "Light-first";
  }
  if (suite.modes.includes("dark") && !suite.modes.includes("light")) {
    return "Dark-first";
  }
  return "Multi-mode";
}

function FeaturedSuiteCard({ suite, onOpenSuite }) {
  return (
    <article className="home-suite-card" data-suite-id={suite.id}>
      <figure className="home-suite-card__preview">
        <SuiteCover suite={suite}/>
        <figcaption>同一场景 · 真实组件预览</figcaption>
      </figure>
      <div className="home-suite-card__body">
        <span className="home-suite-card__identity">
          <strong>{suite.displayName} / {suite.localizedName}</strong>
          <small>{suite.description}</small>
        </span>
        <div className="home-suite-facts">
          <p><strong>{suiteStatusLabels[suite.status]} · v{suite.version}</strong><span>{suite.capabilities.components.length} 类组件</span></p>
          <dl><div><dt>适合</dt><dd>{suite.selection?.suitableFor?.join("、") ?? "适用任务待确认"}</dd></div><div><dt>边界</dt><dd>{suite.selection?.limitations?.join("；") ?? "能力边界待确认"}</dd></div></dl>
        </div>
        <div className="home-suite-card__footer">
          <span className="home-suite-card__tags" aria-label="套系特征">
            <i>{suiteModeLabel(suite)}</i>
            <i>{suite.styleLabel}</i>
            <i>{suite.platforms[0] ?? "web"}</i>
          </span>
          <button type="button" onClick={() => onOpenSuite(suite.id)}>
            进入套系 <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function DirectorySuiteCard({ suite, onOpenSuite }) {
  return (
    <article className="home-directory-card">
      <span className="home-directory-card__swatches" aria-hidden="true">
        {suite.swatches.slice(0, 4).map((color) => <i key={color} style={{ backgroundColor: color }} />)}
      </span>
      <span className="home-directory-card__name">
        <strong>{suite.displayName}</strong>
        <small>{suite.localizedName} · {suiteStatusLabels[suite.status]} · {suite.capabilities.components.length} 类组件</small>
      </span>
      <button type="button" onClick={() => onOpenSuite(suite.id)} aria-label={`进入 ${suite.displayName}`}>
        <ArrowRight size={16} weight="bold" aria-hidden="true" />
      </button>
    </article>
  );
}

export function SuiteCatalog({ suites, onOpenSuite, onCompare }) {
  useEffect(()=>recordEvent("catalog_view"),[]);
  const [query, setQuery] = useState("");
  const featuredSuites = suites.slice(0, 2);
  const directorySuites = suites;
  const filteredDirectory = useMemo(() => {
    return filterSuites(directorySuites, query);
  }, [directorySuites, query]);

  const scrollToSuites = () => document.getElementById("design-systems")?.scrollIntoView({ behavior: "smooth" });
  const scrollToUsage = () => document.getElementById("home-usage")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="lab-home">
      <section className="home-hero" aria-labelledby="home-title">
        <p className="home-eyebrow">CURATED UI SYSTEMS</p>
        <h1 id="home-title"><span>选择一套完整的</span><span>设计语言</span></h1>
        <p className="home-hero__description">
          为独立开发者与小型 SaaS 团队提供可复用组件、完整页面流程和设计规范。先比较，再接入你的 React 项目；也可将真实 API 与规范交给开发工具使用。
        </p>
        <div className="home-hero__actions">
          <a className="home-text-action" href="#kits">完整场景与接入 →</a>
          <button type="button" className="home-primary-action" onClick={scrollToSuites}>浏览设计系统</button>
          <button type="button" className="home-text-action" onClick={onCompare}>同场景对比 <ArrowsLeftRight size={16} aria-hidden="true" /></button>
          <button type="button" className="home-text-action" onClick={scrollToUsage}>如何让 Codex 使用 <ArrowRight size={16} aria-hidden="true" /></button>
        </div>
      </section>

      <section className="home-featured" id="design-systems" aria-labelledby="featured-title">
        <h2 className="lab-visually-hidden" id="featured-title">当前精选套系</h2>

        <div className="home-featured-grid">
          {featuredSuites.map((suite) => <FeaturedSuiteCard key={suite.id} suite={suite} onOpenSuite={onOpenSuite} />)}
        </div>

        {featuredSuites.length > 1 ? (
          <button type="button" className="home-compare-action" onClick={onCompare}>
            <span className="home-compare-action__icon"><ArrowsLeftRight size={22} aria-hidden="true" /></span>
            <span className="home-compare-action__copy">
              <strong>还没决定用哪一套？</strong>
              <small>在同一个画布中切换设计语言，保留数据和编辑状态，看清布局、密度与组件表达。</small>
            </span>
            <span className="home-compare-action__cta">开始对比 <ArrowRight size={15} weight="bold" aria-hidden="true" /></span>
          </button>
        ) : null}
      </section>

      {directorySuites.length > 0 ? (
        <section id="suite-directory" className="home-directory" aria-labelledby="directory-title">
          <header className="home-section-heading">
            <span><small>ALL SYSTEMS</small><h2 id="directory-title">完整套系目录</h2></span>
            <label className="home-directory-search">
              <MagnifyingGlass size={17} aria-hidden="true" />
              <input aria-label="搜索全部套系" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索名称、任务或成熟度" />
            </label>
          </header>
          <div className="home-directory-grid">
            {filteredDirectory.map((suite) => <DirectorySuiteCard key={suite.id} suite={suite} onOpenSuite={onOpenSuite} />)}
          </div>
          {filteredDirectory.length === 0 ? <p className="home-directory-empty">没有匹配的套系，换个关键词试试。</p> : null}
        </section>
      ) : null}

      <section className="home-usage" id="home-usage" aria-labelledby="usage-title">
        <header>
          <small>THREE STEPS</small>
          <h2 id="usage-title">三步开始使用</h2>
          <p>进入套系后获取完整规范与可复制的 Codex 指令。</p>
        </header>
        <ol>
          <li><span>01</span><Stack size={34} aria-hidden="true" /><strong>选择套系</strong><p>从独立设计语言中选择最适合当前产品的一套。</p></li>
          <li><span>02</span><BookOpen size={34} aria-hidden="true" /><strong>浏览规范</strong><p>查看基础 Token、组件七态、页面模式和响应式规则。</p></li>
          <li><span>03</span><Code size={34} aria-hidden="true" /><strong>交给 Codex</strong><p>复制稳定 Suite ID，让实现始终留在所选套系边界内。</p></li>
        </ol>
      </section>
    </main>
  );
}
