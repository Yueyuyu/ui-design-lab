import { QuietCard } from "../../../systems/quiet-workspace/web/index.js";
import { LedgerPanel } from "../../../systems/midnight-ledger/web/index.js";
import {
  ComparisonButtonStates,
  ComparisonChart,
  ComparisonForm,
  ComparisonMetrics,
  supportsComparisonSuite,
} from "./SuiteSceneRenderer.jsx";
import { comparisonModules } from "./scenarios.js";

function SuiteModule({ suite, moduleId, density, visualState, formName, onFormNameChange, onNotify }) {
  if (!supportsComparisonSuite(suite.id)) {
    return <div className="comparison-module__unsupported">{suite.displayName} 尚未提供模块样例。</div>;
  }

  const content = moduleId === "metrics"
    ? <ComparisonMetrics suiteId={suite.id} visualState={visualState} />
    : moduleId === "chart"
      ? <ComparisonChart suiteId={suite.id} visualState={visualState} onRetry={() => onNotify("已重新加载图表")} />
      : moduleId === "form"
        ? <ComparisonForm suiteId={suite.id} visualState={visualState} formName={formName} onFormNameChange={onFormNameChange} onNotify={onNotify} />
        : <ComparisonButtonStates suiteId={suite.id} onNotify={onNotify} />;

  return (
    <section className="comparison-module__suite" data-ui-system={suite.id} data-density={density}>
      <header><strong>{suite.displayName}</strong><small>{suite.localizedName}</small></header>
      {suite.id === "quiet-workspace"
        ? <QuietCard>{content}</QuietCard>
        : <LedgerPanel>{content}</LedgerPanel>}
    </section>
  );
}

export function ModuleBreakdown({
  suiteA,
  suiteB,
  activeModuleId,
  density,
  visualState,
  formName,
  highlightDifferences,
  onModuleChange,
  onFormNameChange,
  onHighlightChange,
  onNotify,
}) {
  return (
    <section className="comparison-modules" data-highlight={highlightDifferences ? "true" : "false"}>
      <header className="comparison-modules__header">
        <div>
          <strong>模块拆解</strong>
          <nav aria-label="模块对比类型">
            {comparisonModules.map((item) => (
              <button type="button" key={item.id} data-active={item.id === activeModuleId ? "true" : "false"} onClick={() => onModuleChange(item.id)}>{item.label}</button>
            ))}
          </nav>
        </div>
        <label className="comparison-highlight-toggle">
          <span>高亮差异</span>
          <button type="button" role="switch" aria-checked={highlightDifferences} data-on={highlightDifferences ? "true" : "false"} onClick={() => onHighlightChange(!highlightDifferences)}><i /></button>
        </label>
      </header>
      <div className="comparison-modules__grid">
        <SuiteModule suite={suiteA} moduleId={activeModuleId} density={density} visualState={visualState} formName={formName} onFormNameChange={onFormNameChange} onNotify={onNotify} />
        <SuiteModule suite={suiteB} moduleId={activeModuleId} density={density} visualState={visualState} formName={formName} onFormNameChange={onFormNameChange} onNotify={onNotify} />
      </div>
    </section>
  );
}
