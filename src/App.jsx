import { Check, Monitor, SlidersHorizontal } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { LabSidebar } from "./gallery/LabSidebar.jsx";
import { ComponentsGallery } from "./gallery/ComponentsGallery.jsx";
import { FoundationsGallery } from "./gallery/FoundationsGallery.jsx";
import { GuidelinesGallery } from "./gallery/GuidelinesGallery.jsx";
import { OverviewGallery } from "./gallery/OverviewGallery.jsx";
import { PatternsGallery } from "./gallery/PatternsGallery.jsx";
import "../systems/quiet-workspace/foundations/tokens.css";
import "../systems/quiet-workspace/web/components.css";

const pages = {
  overview: OverviewGallery,
  foundations: FoundationsGallery,
  components: ComponentsGallery,
  guidelines: GuidelinesGallery,
  patterns: PatternsGallery,
};

function readGalleryLocation() {
  const [pageName, section] = window.location.hash.slice(1).split("/");
  return {
    page: pages[pageName] ? pageName : "overview",
    section,
  };
}

export function App() {
  const [activePage, setActivePage] = useState(() => readGalleryLocation().page);
  const [density, setDensity] = useState("comfortable");
  const [toast, setToast] = useState("");
  const ActivePage = pages[activePage];

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const handleHashChange = () => setActivePage(readGalleryLocation().page);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const location = readGalleryLocation();
    if (location.page !== activePage || !location.section) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.section)?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activePage]);

  const navigate = (page) => {
    setActivePage(page);
    window.history.replaceState(null, "", `#${page}`);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="lab-app">
      <LabSidebar activePage={activePage} onNavigate={navigate} />
      <div className="lab-workspace">
        <header className="lab-topbar">
          <div className="lab-current-suite">
            <span className="lab-current-suite__mark">QW</span>
            <span>
              <strong>Quiet Workspace</strong>
              <small>Suite 01 · v0.3.0</small>
            </span>
          </div>
          <div className="lab-density" aria-label="组件密度">
            <span className="lab-density__label">
              <SlidersHorizontal size={15} aria-hidden="true" />
              密度
            </span>
            <span className="lab-segmented-control">
              <button
                type="button"
                data-active={density === "comfortable" ? "true" : "false"}
                onClick={() => setDensity("comfortable")}
              >
                舒适
              </button>
              <button
                type="button"
                data-active={density === "compact" ? "true" : "false"}
                onClick={() => setDensity("compact")}
              >
                紧凑
              </button>
            </span>
          </div>
        </header>

        <main
          className="lab-content"
          data-ui-system="quiet-workspace"
          data-density={density}
        >
          <div className="lab-page-enter" key={activePage}>
            <ActivePage density={density} onNotify={setToast} onNavigate={navigate} />
          </div>
        </main>
      </div>

      {toast ? (
        <div className="lab-toast" role="status">
          <Check size={15} weight="bold" aria-hidden="true" />
          {toast}
        </div>
      ) : null}

      <div className="lab-viewport-label" aria-hidden="true">
        <Monitor size={14} /> Desktop system
      </div>
    </div>
  );
}
