import { Info } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { suites } from "../registry/suites.js";
import { ComparisonControls } from "./comparison/ComparisonControls.jsx";
import { ModuleBreakdown } from "./comparison/ModuleBreakdown.jsx";
import { SceneNavigation } from "./comparison/SceneNavigation.jsx";
import { SelectionInspector } from "./comparison/SelectionInspector.jsx";
import { SuiteSceneRenderer } from "./comparison/SuiteSceneRenderer.jsx";
import { buildSuiteInstruction, getScenarioById } from "./comparison/scenarios.js";

export function SuiteComparison({ onNotify, onOpenSuite }) {
  const [suiteAId, setSuiteAId] = useState(() => suites[0]?.id ?? "");
  const [suiteBId, setSuiteBId] = useState(() => suites[1]?.id ?? suites[0]?.id ?? "");
  const [activeSlot, setActiveSlot] = useState("a");
  const [scenarioId, setScenarioId] = useState("monthly-review");
  const [viewport, setViewport] = useState("desktop");
  const [density, setDensity] = useState("comfortable");
  const [visualState, setVisualState] = useState("default");
  const [activeModuleId, setActiveModuleId] = useState("chart");
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [formName, setFormName] = useState("八月增长复盘");
  const [settings, setSettings] = useState({ owner: "林简", email: "review@example.com", autoSave: true, notify: true });

  const suiteA = suites.find((suite) => suite.id === suiteAId) ?? suites[0];
  const suiteB = suites.find((suite) => suite.id === suiteBId) ?? suites[1] ?? suites[0];
  const activeSuite = activeSlot === "a" ? suiteA : suiteB;
  const scenario = getScenarioById(scenarioId);
  const prompt = useMemo(() => buildSuiteInstruction({
    suite: activeSuite,
    scenario,
    visualState,
    density,
    viewport,
    formName,
  }), [activeSuite, density, formName, scenario, viewport, visualState]);

  const notify = (message) => onNotify?.(message);
  const updateSettings = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  if (!suiteA || !suiteB || !activeSuite) {
    return <main className="suite-comparison suite-comparison--empty">没有可用于比较的 UI 套系。</main>;
  }

  return (
    <main className="suite-comparison">
      <SceneNavigation activeScenarioId={scenarioId} onSelect={setScenarioId} />

      <section className="comparison-workbench">
        <ComparisonControls
          suites={suites}
          suiteAId={suiteAId}
          suiteBId={suiteBId}
          viewport={viewport}
          density={density}
          visualState={visualState}
          onSuiteAChange={(id) => { setSuiteAId(id); setActiveSlot("a"); }}
          onSuiteBChange={(id) => { setSuiteBId(id); setActiveSlot("b"); }}
          onSwap={() => { setSuiteAId(suiteBId); setSuiteBId(suiteAId); }}
          onViewportChange={setViewport}
          onDensityChange={setDensity}
          onVisualStateChange={setVisualState}
        />

        <div className="comparison-active-switcher">
          <div role="tablist" aria-label="当前画布套系">
            <button type="button" role="tab" aria-selected={activeSlot === "a"} data-active={activeSlot === "a" ? "true" : "false"} onClick={() => setActiveSlot("a")}>{suiteA.displayName}</button>
            <button type="button" role="tab" aria-selected={activeSlot === "b"} data-active={activeSlot === "b" ? "true" : "false"} onClick={() => setActiveSlot("b")}>{suiteB.displayName}</button>
          </div>
          <p><span>数据、表单值和滚动位置保持不变</span><Info size={15} aria-hidden="true" /></p>
        </div>

        <section className="comparison-canvas" aria-live="polite">
          <SuiteSceneRenderer
            suite={activeSuite}
            scenario={scenario}
            viewport={viewport}
            density={density}
            visualState={visualState}
            formName={formName}
            settings={settings}
            onFormNameChange={setFormName}
            onSettingsChange={updateSettings}
            onNotify={notify}
          />
        </section>

        <ModuleBreakdown
          suiteA={suiteA}
          suiteB={suiteB}
          activeModuleId={activeModuleId}
          density={density}
          visualState={visualState}
          formName={formName}
          highlightDifferences={highlightDifferences}
          onModuleChange={setActiveModuleId}
          onFormNameChange={setFormName}
          onHighlightChange={setHighlightDifferences}
          onNotify={notify}
        />
      </section>

      <SelectionInspector
        suite={activeSuite}
        scenario={scenario}
        density={density}
        visualState={visualState}
        prompt={prompt}
        onNotify={notify}
        onEnterSuite={(suiteId) => onOpenSuite?.(suiteId)}
      />
    </main>
  );
}
