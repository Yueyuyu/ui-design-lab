import { AdapterMessage, useComparisonAdapter } from "./AdapterProvider.jsx";
import { sharedSceneData } from "./scenarios.js";

export function SuiteSceneRenderer({ suite, scenario, viewport, density, ...props }) {
  const adapter = useComparisonAdapter(suite);
  const Scene = adapter.module?.Scene;
  return <div className="comparison-canvas__viewport" data-viewport={viewport}>
    <section className="comparison-suite-scene" data-ui-system={suite.id} data-density={density}>
      <header className="comparison-suite-scene__header">
        <span><small>SUITE {String(suite.order).padStart(2, "0")}</small><h2>{suite.displayName}</h2><p>{scenario.description}</p></span>
        <ComparisonSuiteStatus suite={suite} />
      </header>
      <div className="comparison-suite-scene__content">
        {Scene && suite.comparison.scenarios.includes(scenario.id)
          ? <Scene scenarioId={scenario.id} data={sharedSceneData} {...props} />
          : <AdapterMessage suite={suite} adapter={adapter} kind="scenarios" id={scenario.id} />}
      </div>
    </section>
  </div>;
}

export function ComparisonSuiteStatus({ suite }) {
  const adapter = useComparisonAdapter(suite);
  const Status = adapter.module?.Status;
  return Status ? <Status suite={suite} /> : <span className="comparison-neutral-status">{({stable:"稳定",experimental:"实验",draft:"草稿",deprecated:"已弃用"})[suite.status]}</span>;
}
