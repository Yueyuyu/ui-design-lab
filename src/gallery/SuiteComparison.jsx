import './comparison/focused-comparison.css';
import { recordEvent } from "./telemetry.js";
import { PublicPageHeading } from "./PublicPageHeading.jsx";
import {suiteApiContext} from "./ai-context.js";
import { ComparisonPersistence } from "./comparison/ComparisonPersistence.jsx";
import { useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { AdapterProvider } from "./comparison/AdapterProvider.jsx";
import { copyText } from "./copyText.js";
import { suites } from "../registry/suites.js";
import { ComparisonControls } from "./comparison/ComparisonControls.jsx";
import { ModuleBreakdown } from "./comparison/ModuleBreakdown.jsx";
import { SceneNavigation } from "./comparison/SceneNavigation.jsx";
import { SelectionInspector } from "./comparison/SelectionInspector.jsx";
import { SuiteSceneRenderer } from "./comparison/SuiteSceneRenderer.jsx";
import { buildSuiteInstruction, getScenarioById } from "./comparison/scenarios.js";

import {createRecordWorkflow,recordWorkflowReducer} from "./comparison/record-workflow.js";

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
  const [workflow, dispatchWorkflow] = useReducer(recordWorkflowReducer, undefined, createRecordWorkflow);
  const scrollPosition = useRef(null);
  const canvasRef = useRef(null);
  const scrollTailRef = useRef(null);
  const changeSlot = (slot) => {
    scrollPosition.current = { x: window.scrollX, y: window.scrollY, canvas: canvasRef.current?.scrollTop ?? 0 };
    setActiveSlot(slot);
  };
  useLayoutEffect(() => {
    if (!scrollPosition.current) return;
    // 短套系会缩小 document 的最大滚动位置。只补齐视口所需的底部余量，组件保持自身高度。
    const tail = scrollTailRef.current;
    const naturalHeight = document.documentElement.scrollHeight - (tail?.offsetHeight ?? 0);
    if (tail) tail.style.height = Math.max(0, scrollPosition.current.y + window.innerHeight - naturalHeight) + "px";
    window.scrollTo({ left: scrollPosition.current.x, top: scrollPosition.current.y, behavior: "instant" });
    if (canvasRef.current) canvasRef.current.scrollTop = scrollPosition.current.canvas;
    scrollPosition.current = null;
  }, [activeSlot]);
  useLayoutEffect(() => {
    if (scrollTailRef.current) scrollTailRef.current.style.height = "0px";
  }, [scenarioId, density, viewport]);

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
    settings, workflow,
  })+"\n"+suiteApiContext(activeSuite), [activeSuite, density, formName, settings, scenario, viewport, visualState, workflow]);

  // 只在选择场景或套系时调整支持的搭配；业务数据始终由父级保留。
  const chooseScenario = id => {
    const supported = suites.filter(suite => suite.comparison?.scenarios.includes(id));
    const nextA = supported.find(suite => suite.id === suiteAId) ?? supported[0];
    const nextB = supported.find(suite => suite.id === suiteBId && suite.id !== nextA?.id) ?? supported.find(suite => suite.id !== nextA?.id) ?? nextA;
    if(nextA && nextB) { setSuiteAId(nextA.id); setSuiteBId(nextB.id); if(!nextA.densities.includes(density) || !nextB.densities.includes(density)) setDensity('comfortable'); }
    setScenarioId(id);
    if(id === 'record-workflow') setActiveModuleId('record-detail');
  };
  const chooseSuite = (slot, id) => {
    const chosen = suites.find(suite => suite.id === id);
    if(slot === 'a') setSuiteAId(id); else setSuiteBId(id);
    setActiveSlot(slot);
    if(!chosen.densities.includes(density)) setDensity(chosen.densities[0]);
    if(!chosen.comparison?.scenarios.includes(scenarioId) && chosen.comparison?.scenarios.length) {
      const next = chosen.comparison.scenarios[0];
      const partner = suites.find(suite => suite.id !== id && suite.comparison?.scenarios.includes(next));
      setScenarioId(next);
      if(partner) { if(slot === 'a') setSuiteBId(partner.id); else setSuiteAId(partner.id); }
      if(next === 'record-workflow') setActiveModuleId('record-detail');
    }
  };
  const notify = (message) => onNotify?.(message);
  const copyInstruction = async () => {
    try { await copyText(prompt); recordEvent("instruction_copy"); notify("当前场景指令已复制"); }
    catch { notify("复制失败，请手动选择右侧指令"); }
  };
  const updateSettings = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  if (!suiteA || !suiteB || !activeSuite) {
    return <main className="suite-comparison suite-comparison--empty">没有可用于比较的 UI 套系。</main>;
  }

  return (
    <AdapterProvider suiteA={suiteA} suiteB={suiteB}><main className="suite-comparison public-container">
      <PublicPageHeading title="同场景对比" description="同一份内容，感受不同的设计语言。" />
      <SceneNavigation activeScenarioId={scenarioId} onSelect={chooseScenario} />


      <section className="comparison-workbench">
        <ComparisonControls
          suites={suites}
          suiteAId={suiteAId}
          suiteBId={suiteBId}
          viewport={viewport}
          density={density}
          visualState={visualState}
          onSuiteAChange={id => chooseSuite("a",id)}
          onSuiteBChange={id => chooseSuite("b",id)}
          onSwap={() => { setSuiteAId(suiteBId); setSuiteBId(suiteAId); }}
          onViewportChange={setViewport}
          onDensityChange={setDensity}
          densities={suiteA.densities.filter(item => suiteB.densities.includes(item))}
          onVisualStateChange={setVisualState}
        />

        <div className="comparison-active-switcher">
          <div role="tablist" aria-label="当前画布套系">
            <button type="button" role="tab" aria-selected={activeSlot === "a"} data-active={activeSlot === "a" ? "true" : "false"} onClick={() => changeSlot("a")}>{suiteA.displayName}</button>
            <button type="button" role="tab" aria-selected={activeSlot === "b"} data-active={activeSlot === "b" ? "true" : "false"} onClick={() => changeSlot("b")}>{suiteB.displayName}</button>
          </div>
          <a className="comparison-adopt" href={`#/usage?suite=${activeSuite.id}`}>采用{activeSuite.localizedName} →</a>
        </div>

        <section ref={canvasRef} className="comparison-canvas" aria-live="polite">
          <SuiteSceneRenderer
            suite={activeSuite}
            scenario={scenario}
            viewport={viewport}
            density={density}
            visualState={visualState}
            formName={formName}
            settings={settings}
            workflow={workflow} onWorkflowAction={dispatchWorkflow}
            onFormNameChange={setFormName}
            onSettingsChange={updateSettings}
            onNotify={notify}
            onCopy={copyInstruction}
            onRetry={() => { setVisualState("default"); if (scenarioId === "empty-state") setScenarioId("monthly-review"); }}
          />
        </section>

<ComparisonPersistence snapshot={{schemaVersion:1,suiteAId,suiteBId,versions:{[suiteAId]:suiteA.version,[suiteBId]:suiteB.version},activeSlot,scenarioId,viewport,density,visualState,formName,settings,workflow}} onNotify={onNotify} onRestore={v=>{setSuiteAId(v.suiteAId);setSuiteBId(v.suiteBId);setActiveSlot(v.activeSlot);setScenarioId(v.scenarioId);setViewport(v.viewport);setDensity(v.density);setVisualState(v.visualState);setFormName(v.formName);setSettings(v.settings);if(v.workflow) dispatchWorkflow({type:"restore",value:v.workflow});if(v.scenarioId==="record-workflow")setActiveModuleId("record-detail");}}/>
        <details className="comparison-tools comparison-modules"><summary>按模块查看差异</summary><ModuleBreakdown
          suiteA={suiteA}
          suiteB={suiteB}
          activeModuleId={activeModuleId}
          density={density}
          visualState={visualState}
          formName={formName}
          highlightDifferences={highlightDifferences}
          workflow={workflow} onWorkflowAction={dispatchWorkflow}
          onModuleChange={setActiveModuleId}
          onFormNameChange={setFormName}
          onHighlightChange={setHighlightDifferences}
          onNotify={notify}
          onCopy={copyInstruction}
          onRetry={() => setVisualState("default")}
        /></details>
      </section>

      <details className="comparison-tools comparison-instructions"><summary>套系说明与 Agent 指令</summary><SelectionInspector
        suite={activeSuite}
        scenario={scenario}
        density={density}
        visualState={visualState}
        prompt={prompt}
        onNotify={notify}
        onEnterSuite={(suiteId) => onOpenSuite?.(suiteId)}
      /></details>
    </main><div ref={scrollTailRef} aria-hidden="true" /></AdapterProvider>
  );
}
