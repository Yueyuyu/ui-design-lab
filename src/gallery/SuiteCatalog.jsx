import { ArrowRight, ArrowUpRight, Circle, CircleHalf, MagnifyingGlass, Moon, Stack, Sun, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { recordEvent } from "./telemetry.js";
import { SuiteCover } from "./SuiteCover.jsx";
import { filterSuites, suiteStatusLabels } from "./catalog-data.js";
import { PublicPageHeading } from "./PublicPageHeading.jsx";

function SuiteCard({ suite, onOpenSuite }) {
  const preview = suite.selection?.scenePreview;
  const ModeIcon = suite.modes.length > 1 ? CircleHalf : suite.modes[0] === "dark" ? Moon : Sun;
  return (
    <article className="catalog-card" data-suite-id={suite.id}>
      <div className="catalog-card__preview">
        <SuiteCover suite={suite} presentation="scene" />
        <button className="catalog-card__preview-link" type="button" onClick={() => onOpenSuite(suite.id, 'components')} aria-label={`预览 ${suite.displayName} 套系`}><span className="catalog-card__preview-action">查看体系与用法 <ArrowRight size={15} aria-hidden="true" /></span></button>
      </div>
      <div className="catalog-card__body">
        <div className="catalog-card__heading">
          <h2><span className="catalog-card__name">{suite.displayName}</span>{" "}<span className="catalog-card__localized"><span aria-hidden="true">/</span> {suite.localizedName}</span></h2>
          <button className="catalog-card__enter" type="button" onClick={() => onOpenSuite(suite.id, 'components')} aria-label={`进入 ${suite.displayName}`}><ArrowUpRight size={21} aria-hidden="true" /></button>
        </div>
        <p>{suite.selection?.summary ?? suite.description}</p>
        {preview && <p className="catalog-card__scene">{preview.title}<span>应用概念</span></p>}
        <div className="catalog-card__meta">
          <span data-status={suite.status}><Circle className="catalog-card__status-icon" size={12} weight="fill" aria-hidden="true" />{suiteStatusLabels[suite.status]}</span>
          <span><Stack size={18} aria-hidden="true" />{suite.capabilities.components.length} 类组件</span>
          <span className="catalog-card__mode" data-mode={suite.modes.length > 1 ? "mixed" : suite.modes[0]}><ModeIcon size={16} weight="duotone" aria-hidden="true" />{suite.modes.map(mode => mode === "light" ? "浅色" : "深色").join(" / ")}</span>
          <span className="catalog-card__version">v{suite.version}</span>
        </div>
      </div>
    </article>
  );
}

export function SuiteCatalog({ suites, onOpenSuite }) {
  useEffect(() => recordEvent("catalog_view"), []);
  const [query, setQuery] = useState("");
  const filteredSuites = useMemo(() => filterSuites(suites, query), [suites, query]);
  return (
    <main className="catalog-page public-container">
      <PublicPageHeading className="catalog-intro" id="suite-directory-title" title="探索设计体系" description="为你的产品，找到合适的设计语言。" />
      <section id="suite-directory" aria-labelledby="suite-directory-title">
        <div className="catalog-toolbar">
          <label className="catalog-search"><MagnifyingGlass size={23} aria-hidden="true" /><input aria-label="搜索全部套系" placeholder="搜索设计体系或场景关键词…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" onClick={() => setQuery("")} aria-label="清除搜索"><X size={18} aria-hidden="true" /></button>}</label>
        </div>
        <div className="catalog-grid">{filteredSuites.map(suite => <SuiteCard key={suite.id} suite={suite} onOpenSuite={onOpenSuite} />)}</div>
        {filteredSuites.length === 0 && <div className="catalog-empty"><h2>没有找到匹配的设计系统</h2><p>试试其他名称或场景关键词。</p><button type="button" onClick={() => setQuery("")}>重置筛选</button></div>}
        <p className="catalog-result" role="status">{query ? `找到 ${filteredSuites.length} 套设计系统` : `共 ${suites.length} 套独立设计系统`}</p>
      </section>
      <footer className="catalog-footer"><p>场景展示设计语言，具体可用能力以套系文档为准。</p><a href="#/usage">用这套语言开始设计 <ArrowUpRight size={16} aria-hidden="true" /></a></footer>
    </main>
  );
}
