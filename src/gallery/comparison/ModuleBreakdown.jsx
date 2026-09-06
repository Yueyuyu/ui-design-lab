import { AdapterMessage, useComparisonAdapter } from "./AdapterProvider.jsx";
import { comparisonModules, sharedSceneData } from "./scenarios.js";

function SuiteModule({ suite, moduleId, density, ...props }) {
  const adapter = useComparisonAdapter(suite);
  const Module = adapter.module?.Module;
  return <section className="comparison-module__suite" data-ui-system={suite.id} data-density={density}>
    <header><strong>{suite.displayName}</strong><small>{suite.localizedName}</small></header>
    {Module && suite.comparison.modules.includes(moduleId)
      ? <Module moduleId={moduleId} data={sharedSceneData} {...props} />
      : <AdapterMessage suite={suite} adapter={adapter} kind="modules" id={moduleId} />}
  </section>;
}

export function ModuleBreakdown({
  suiteA, suiteB, activeModuleId, density, highlightDifferences,
  onModuleChange, onHighlightChange, ...props
}) {
  return <section className="comparison-modules" data-highlight={highlightDifferences ? "true" : "false"}>
    <header className="comparison-modules__header">
      <div><strong>模块拆解</strong><nav aria-label="模块对比类型">
        {comparisonModules.map((item) => <button type="button" key={item.id} aria-pressed={item.id === activeModuleId} data-active={item.id === activeModuleId ? "true" : "false"} onClick={() => onModuleChange(item.id)}>{item.label}</button>)}
      </nav></div>
      <label className="comparison-highlight-toggle"><span>高亮差异</span><button type="button" role="switch" aria-label="高亮差异" aria-checked={highlightDifferences} data-on={highlightDifferences ? "true" : "false"} onClick={() => onHighlightChange(!highlightDifferences)}><i /></button></label>
    </header>
    <div className="comparison-modules__grid">
      <SuiteModule suite={suiteA} moduleId={activeModuleId} density={density} {...props} />
      <SuiteModule suite={suiteB} moduleId={activeModuleId} density={density} {...props} />
    </div>
  </section>;
}
