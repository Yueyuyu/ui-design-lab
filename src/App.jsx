import {
  ArrowsClockwise,
  CaretDown,
  Check,
  CirclesFour,
  Clover,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Flask,
  MagnifyingGlass,
  Monitor,
  SlidersHorizontal
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LabSidebar } from "./gallery/LabSidebar.jsx";
import { SuiteCatalog } from "./gallery/SuiteCatalog.jsx";
import { SuiteComparison } from "./gallery/SuiteComparison.jsx";
import { getSuiteById, suites } from "./registry/suites.js";

const viewportOptions = [
  { id: "desktop", label: "桌面", icon: Desktop },
  { id: "tablet", label: "平板", icon: DeviceTablet },
  { id: "mobile", label: "手机", icon: DeviceMobile }
];

function readGalleryLocation() {
  const parts = window.location.hash.slice(1).split("/").filter(Boolean);
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
    page: parts[2] || "overview",
    section: parts[3]
  };
}

function replaceHash(hash) {
  window.history.replaceState(null, "", hash);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

function PublicHeader({ activeView, onHome, onSystems, onCompare, onUsage }) {
  const BrandIcon = activeView === "compare" ? Clover : Flask;
  return (
    <header className="lab-public-header" data-view={activeView}>
      <button type="button" className="lab-public-brand" onClick={onHome} aria-label="返回 UI Design Lab 首页">
        <BrandIcon size={27} weight={activeView === "compare" ? "fill" : "regular"} aria-hidden="true" />
        <span><strong>UI Design Lab</strong><small>视觉系统实验室</small></span>
      </button>
      <nav aria-label="首页导航">
        <button type="button" data-active={activeView === "catalog" ? "true" : "false"} aria-current={activeView === "catalog" ? "page" : undefined} onClick={onSystems}>设计系统</button>
        <button type="button" onClick={onUsage}>使用方式</button>
        <button type="button" data-active={activeView === "compare" ? "true" : "false"} aria-current={activeView === "compare" ? "page" : undefined} onClick={onCompare}>同场景对比</button>
      </nav>
      <button type="button" className="lab-public-all" onClick={onSystems}>查看全部套系 <span aria-hidden="true">→</span></button>
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
                {suite.referenceImageUrl ? <img src={suite.referenceImageUrl} alt="" aria-hidden="true" /> : null}
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
    let active = true;
    setSuiteModule(null);
    if (!currentSuite?.loadShowcase) {
      return () => { active = false; };
    }

    currentSuite.loadShowcase().then((module) => {
      if (active) {
        setSuiteModule(module);
      }
    });
    return () => { active = false; };
  }, [currentSuite]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!location.section || !suiteModule) {
      return undefined;
    }
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.section)?.scrollIntoView({ block: "start" });
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

  const scrollHomeSection = (sectionId) => {
    const scroll = () => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    if (location.view !== "catalog") {
      replaceHash("#systems");
      window.requestAnimationFrame(scroll);
      return;
    }
    scroll();
  };

  const openCatalog = () => {
    replaceHash("#systems");
    setSuiteMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const openCompare = () => {
    replaceHash("#compare");
    setSuiteMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const openSuite = (suiteId) => {
    replaceHash(`#systems/${suiteId}/overview`);
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
    replaceHash(`#systems/${currentSuite.id}/${page}`);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  if (location.view !== "suite") {
    return (
      <div className="lab-public-app" data-view={location.view}>
        <PublicHeader
          activeView={location.view}
          onHome={openCatalog}
          onSystems={() => scrollHomeSection("design-systems")}
          onUsage={() => scrollHomeSection("home-usage")}
          onCompare={openCompare}
        />
        {location.view === "catalog" ? (
          <SuiteCatalog suites={suites} onOpenSuite={openSuite} onCompare={openCompare} />
        ) : (
          <SuiteComparison onNotify={setToast} onOpenSuite={openSuite} />
        )}
        {toast ? <div className="lab-toast" role="status"><Check size={15} weight="bold" aria-hidden="true" />{toast}</div> : null}
      </div>
    );
  }

  const ActivePage = suiteModule?.pages?.[location.page] ?? suiteModule?.pages?.overview;
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
        activePage={location.page}
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
            {ActivePage ? (
              <div className="lab-page-enter" key={`${currentSuite.id}-${location.page}`}>
                <ActivePage suite={currentSuite} density={density} onNotify={setToast} onNavigate={navigatePage} />
              </div>
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
