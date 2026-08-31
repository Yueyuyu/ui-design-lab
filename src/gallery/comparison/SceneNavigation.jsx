import { Info } from "@phosphor-icons/react";
import { comparisonScenarios } from "./scenarios.js";

export function SceneNavigation({ activeScenarioId, onSelect }) {
  return (
    <aside className="comparison-scenes" aria-label="比较场景">
      <div className="comparison-scenes__body">
        <h1>场景</h1>
        <nav>
          {comparisonScenarios.map((scenario) => {
            const Icon = scenario.icon;
            const isActive = scenario.id === activeScenarioId;
            return (
              <button
                type="button"
                key={scenario.id}
                data-active={isActive ? "true" : "false"}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(scenario.id)}
              >
                <Icon size={19} weight={isActive ? "bold" : "regular"} aria-hidden="true" />
                <span>{scenario.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <p className="comparison-scenes__note">
        <Info size={16} aria-hidden="true" />
        <span>所有场景使用相同的数据、表单值和交互状态进行套系对比。</span>
      </p>
    </aside>
  );
}
