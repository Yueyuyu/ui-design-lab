import {documentationAliases} from "./gallery/docs/navigation.js";
import {SuiteCover} from "./gallery/SuiteCover.jsx";
import {recordEvent} from "./gallery/telemetry.js";
import githubMark from "./gallery/assets/github-mark.svg";
import {
  ArrowsClockwise,
  ArrowUpRight,
  CaretDown,
  Check,
  CirclesFour,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Flask,
  MagnifyingGlass,
  Monitor,
  SlidersHorizontal
} from "@phosphor-icons/react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { LoadBoundary } from "./gallery/LoadBoundary.jsx";
import { LabSidebar } from "./gallery/LabSidebar.jsx";
import { SuiteCatalog } from "./gallery/SuiteCatalog.jsx";
import { SuiteExamples } from "./gallery/SuiteExamples.jsx";
import { getSuiteById, suites } from "./registry/suites.js";
const SuiteComparison = lazy(() => import("./gallery/SuiteComparison.jsx").then((module) => ({ default: module.SuiteComparison })));
const UsageGuide = lazy(() => import("./gallery/UsageGuide.jsx").then(module => ({ default: module.UsageGuide })));
const ScenePlayer = lazy(() => import("./gallery/ScenePlayer.jsx").then(module => ({default:module.ScenePlayer})));

const viewportOptions = [
  { id: "desktop", label: "桌面", icon: Desktop },
  { id: "tablet", label: "平板", icon: DeviceTablet },
  { id: "mobile", label: "手机", icon: DeviceMobile }
];

function readGalleryLocation() {
  const parts = window.location.hash.slice(1).split("?")[0].split("/").filter(Boolean);
  if(parts[0]==="scenes") return {view:"scene",kitId:parts[1],suiteId:null};
  if(parts[0]==="cover"&&getSuiteById(parts[1]))return {view:"cover",suiteId:parts[1],page:null,section:null};
  // 旧场景目录回到设计系统入口，独立示例与文档深链继续有效。
  if(parts[0]==="kits") return {view:"catalog",suiteId:null,page:null,section:null};
  if(parts[0]==="usage") return {view:"usage",suiteId:null,page:parts[1] ?? null,section:null};
  if (parts[0] === "compare") {
    return { view: "compare", suiteId: null, page: null, section: null };
  }
  if (parts[0] !== "systems" || !parts[1]) {
    return { view: "catalog", suiteId: null, page: null, section: null };
  }

  const suite = getSuiteById(parts[1]);
  if (!suite) {
    return { view: "catalog", suiteId: null, page: null, section: null };
  }

  return {
    view: "suite",
    suiteId: suite.id,
    page: (documentationAliases[parts[2]] ?? parts[2] ?? "overview").split("/")[0],
    section: documentationAliases[parts[2]]?.split("/")[1] ?? parts[3]
  };
}

function navigateHash(hash) {
  window.history.pushState(null, "", hash);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

function PublicHeader({ activeView, onHome }) {
  return (
    <header className="lab-public-header" data-view={activeView}>
      <button type="button" className="lab-public-brand" onClick={onHome} aria-label="返回 UI Design Lab 首页">
        <Flask size={46} weight="regular" aria-hidden="true" />
        <span><strong>UI Design Lab</strong><small>视觉系统实验室</small></span>
      </button>
      <nav aria-label="首页导航">
        {[{ view: "catalog", href: "#/systems", label: "设计系统" }, { view: "usage", href: "#/usage", label: "使用方式" }, { view: "compare", href: "#/compare", label: "同场景对比" }].map(item => <a key={item.view} href={item.href} aria-current={activeView === item.view ? "page" : undefined}>{item.label}</a>)}
      </nav>
      <a className="public-repository" href="https://github.com/Yueyuyu/ui-design-lab" target="_blank" rel="noreferrer" aria-label="GitHub 仓库（新窗口打开）"><img className="public-repository__mark" src={githubMark} width="30" height="30" alt="" /><span>GitHub</span><ArrowUpRight size={21} aria-hidden="true" /></a>
    </header>
  );
}

function SuiteSwitcher({ currentSuite, isOpen, query, onQueryChange, onToggle, onSelectSuite }) {
  const visibleSuites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return suites;
    }
    return suites.filter((suite) => [suite.displayName, suite.localizedName, suite.styleLabel, ...suite.tags]
      .some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [query]);

  return (
    <div className="lab-suite-switcher">
      <button type="button" className="lab-suite-switcher__trigger" aria-expanded={isOpen} onClick={onToggle}>
        <ArrowsClockwise size={16} weight="bold" aria-hidden="true" />
        切换设计套系
        <CaretDown size={14} weight="bold" aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="lab-suite-switcher__popover" role="dialog" aria-label="切换设计套系">
          {suites.length > 4 ? (
            <label className="lab-suite-switcher__search">
              <MagnifyingGlass size={16} aria-hidden="true" />
              <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="搜索套系" autoFocus />
            </label>
          ) : null}
          <div className="lab-suite-switcher__list">
            {visibleSuites.map((suite) => (
              <button
                type="button"
                key={suite.id}
                data-active={suite.id === currentSuite.id ? "true" : "false"}
                onClick={() => onSelectSuite(suite.id)}
              >
                {suite.thumbnailUrl ? <img src={suite.thumbnailUrl} alt="" aria-hidden="true" loading="lazy" /> : null}
                <span><strong>{suite.displayName}</strong><small>{suite.localizedName}</small></span>
                {suite.id === currentSuite.id ? <Check size={18} weight="bold" aria-label="当前套系" /> : <span className="lab-suite-switcher__enter">进入</span>}
              </button>
            ))}
          </div>
          {visibleSuites.length === 0 ? <p className="lab-suite-switcher__empty">没有匹配的套系。</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export function App() {
  const [location, setLocation] = useState(() => readGalleryLocation());
  const [suiteModule, setSuiteModule] = useState(null);
  const [suiteLoadError, setSuiteLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [density, setDensity] = useState("comfortable");
  const [viewport, setViewport] = useState("desktop");
  const [toast, setToast] = useState("");
  const [suiteMenuOpen, setSuiteMenuOpen] = useState(false);
  const [suiteQuery, setSuiteQuery] = useState("");
  const suiteMenuRef = useRef(null);
  const currentSuite = useMemo(() => getSuiteById(location.suiteId), [location.suiteId]);

  useEffect(() => {
    const handleHashChange = () => setLocation(readGalleryLocation());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (location.view !== "suite") window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.view]);

  useEffect(() => {
    let active = true;
    setSuiteModule(null);
    setSuiteLoadError(false);
    if (!currentSuite?.loadShowcase) {
      return () => { active = false; };
    }

    currentSuite.loadShowcase().then((module) => {
      if (active) {
        setSuiteModule(module);
      }
    }).catch(() => { if (active) setSuiteLoadError(true); });
    return () => { active = false; };
  }, [currentSuite, loadAttempt]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!suiteModule || location.view !== 'suite') {
      return undefined;
    }
    const frame = window.requestAnimationFrame(() => {
      const target = location.section && document.getElementById(location.section);
      if (target) target.scrollIntoView({ block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.section, suiteModule, location.page]);

  useEffect(() => {
    if (!suiteMenuOpen) {
      return undefined;
    }
    const handlePointerDown = (event) => {
      if (!suiteMenuRef.current?.contains(event.target)) {
        setSuiteMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSuiteMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [suiteMenuOpen]);

  const openCatalog = () => {
    navigateHash("#systems");
    setSuiteMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const openSuite = (suiteId, page = "overview") => {
    recordEvent("suite_open",{suiteId});
    navigateHash(`#systems/${suiteId}/${page}`);
    setDensity("comfortable");
    setViewport("desktop");
    setSuiteMenuOpen(false);
    setSuiteQuery("");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const navigatePage = (page) => {
    if (!currentSuite) {
      return;
    }
    navigateHash(`#systems/${currentSuite.id}/${page}`);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  if(location.view==="cover")return <div className="cover-export"><SuiteCover suite={getSuiteById(location.suiteId)}/></div>;
  if(location.view==="scene") return <LoadBoundary><Suspense fallback={<p role="status">正在加载场景…</p>}><ScenePlayer key={location.kitId} kitId={location.kitId}/></Suspense></LoadBoundary>;
  if (location.view !== "suite") {
    return (
      <div className="lab-public-app" data-view={location.view}>
        <PublicHeader
          activeView={location.view}
          onHome={openCatalog}
        />
        {location.view === "usage" ? <LoadBoundary><Suspense fallback={<p>正在加载使用指南…</p>}><UsageGuide reference={location.page}/></Suspense></LoadBoundary> : location.view === "catalog" ? (
          <SuiteCatalog suites={suites} onOpenSuite={openSuite} />
        ) : (
          <LoadBoundary><Suspense fallback={<div className="lab-loading" role="status">正在加载比较工作台…</div>}><SuiteComparison onNotify={setToast} onOpenSuite={openSuite} /></Suspense></LoadBoundary>
        )}
        {toast ? <div className="lab-toast" role="status"><Check size={15} weight="bold" aria-hidden="true" />{toast}</div> : null}
      </div>
    );
  }

  const ActivePage = suiteModule && location.page === 'patterns' && !location.section
    ? SuiteExamples : suiteModule?.pages?.[location.page];
  const shell = currentSuite.galleryShell ?? {};
  const shellStyle = {
    "--lab-shell-surface": shell.surface ?? "#eef1ed",
    "--lab-shell-sidebar": shell.sidebar ?? "#f3f5f1",
    "--lab-shell-topbar": shell.topbar ?? "#fbfcfa",
    "--lab-shell-text": shell.text ?? "#2d3531",
    "--lab-shell-muted": shell.muted ?? "#6b746e",
    "--lab-shell-border": shell.border ?? "#d9ded8",
    "--lab-shell-active": shell.active ?? "#dfe8e2",
    "--lab-shell-accent": shell.accent ?? currentSuite.swatches[1],
    "--lab-shell-on-accent": shell.onAccent ?? "#ffffff"
  };

  return (
    <div className="lab-app lab-app--suite" data-active-suite={currentSuite.id} style={shellStyle}>
      <LabSidebar
        currentSuite={currentSuite}
        navigation={suiteModule?.navigation}
        componentEntries={suiteModule?.componentEntries}
        activePage={location.page}
        activeSection={location.section}
        onCatalog={openCatalog}
        onNavigate={navigatePage}
      />

      <div className="lab-workspace">
        <header className="lab-topbar">
          <div className="lab-current-suite">
            <span className="lab-current-suite__mark">{currentSuite.shortCode}</span>
            <span>
              <strong>{currentSuite.displayName}</strong>
              <small>Suite {String(currentSuite.order).padStart(2, "0")} · v{currentSuite.version} · {currentSuite.status}</small>
            </span>
          </div>

          <div className="lab-topbar__actions">
            <div ref={suiteMenuRef}>
              <SuiteSwitcher
                currentSuite={currentSuite}
                isOpen={suiteMenuOpen}
                query={suiteQuery}
                onQueryChange={setSuiteQuery}
                onToggle={() => setSuiteMenuOpen((value) => !value)}
                onSelectSuite={openSuite}
              />
            </div>
            <button type="button" className="lab-directory-button" onClick={openCatalog}><CirclesFour size={16} aria-hidden="true" />套系目录</button>
            <div className="lab-preview-controls">
              {currentSuite.densities.length > 1 ? (
                <div className="lab-density" aria-label="组件密度">
                  <span className="lab-density__label"><SlidersHorizontal size={15} aria-hidden="true" />密度</span>
                  <span className="lab-segmented-control">
                    {currentSuite.densities.map((value) => (
                      <button type="button" key={value} data-active={density === value ? "true" : "false"} onClick={() => setDensity(value)}>
                        {value === "comfortable" ? "舒适" : value === "compact" ? "紧凑" : value}
                      </button>
                    ))}
                  </span>
                </div>
              ) : null}

              <div className="lab-viewport-control" aria-label="预览尺寸">
                {viewportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button type="button" key={option.id} data-active={viewport === option.id ? "true" : "false"} aria-label={option.label} title={option.label} onClick={() => setViewport(option.id)}>
                      <Icon size={16} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="lab-preview-frame" data-viewport={viewport}>
          <main className="lab-content" data-ui-system={currentSuite.id} data-density={density} data-viewport={viewport}>
            {suiteLoadError ? <div className="lab-load-error" role="alert"><h2>套系加载失败</h2><p>请检查连接后重试。</p><button type="button" onClick={() => setLoadAttempt((value) => value + 1)}>重新加载套系</button></div> : ActivePage ? (
              <div className="lab-page-enter" key={`${currentSuite.id}-${location.page}-${location.section ?? ""}`}>
                <LoadBoundary key={`${currentSuite.id}-${location.page}-${location.section ?? ""}`}><ActivePage suite={currentSuite} patternEntries={suiteModule?.patternEntries} density={density} section={location.section} onNotify={setToast} onNavigate={navigatePage} /></LoadBoundary>
              </div>
            ) : suiteModule ? (
              <div className="lab-load-error"><h2>未找到这个页面</h2><p>当前套系没有此栏目，请从文档导航重新选择。</p><button type="button" onClick={() => navigatePage("overview")}>返回套系总览</button></div>
            ) : (
              <div className="lab-loading">正在加载 {currentSuite.displayName}…</div>
            )}
          </main>
        </div>
      </div>

      {toast ? <div className="lab-toast" role="status"><Check size={15} weight="bold" aria-hidden="true" />{toast}</div> : null}
      <div className="lab-viewport-label" aria-hidden="true"><Monitor size={14} />{viewport} preview</div>
    </div>
  );
}
