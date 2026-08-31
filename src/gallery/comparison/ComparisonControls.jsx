import {
  ArrowsLeftRight,
  Desktop,
  DeviceMobile,
  SlidersHorizontal,
  Sparkle,
} from "@phosphor-icons/react";
import { comparisonStates, getSuiteMarkColor } from "./scenarios.js";

function SuiteSelect({ label, value, suites, onChange }) {
  const suite = suites.find((item) => item.id === value) ?? suites[0];
  return (
    <label className="comparison-control comparison-control--suite">
      <span className="comparison-control__label">{label}</span>
      <span className="comparison-suite-select">
        <i style={{ background: getSuiteMarkColor(suite ?? {}) }}>{suite?.shortCode ?? "?"}</i>
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {suites.map((item) => <option value={item.id} key={item.id}>{item.displayName}</option>)}
        </select>
      </span>
    </label>
  );
}

function CompactSelect({ icon: Icon, value, options, label, onChange }) {
  return (
    <label className="comparison-compact-select">
      <span className="lab-visually-hidden">{label}</span>
      <Icon size={18} aria-hidden="true" />
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {options.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}
      </select>
    </label>
  );
}

export function ComparisonControls({
  suites,
  suiteAId,
  suiteBId,
  viewport,
  density,
  visualState,
  onSuiteAChange,
  onSuiteBChange,
  onSwap,
  onViewportChange,
  onDensityChange,
  onVisualStateChange,
}) {
  const ViewportIcon = viewport === "mobile" ? DeviceMobile : Desktop;
  return (
    <div className="comparison-controls">
      <SuiteSelect label="Suite A" value={suiteAId} suites={suites} onChange={onSuiteAChange} />
      <button type="button" className="comparison-swap" onClick={onSwap} aria-label="交换 Suite A 与 Suite B" title="交换 A / B">
        <ArrowsLeftRight size={20} aria-hidden="true" />
      </button>
      <SuiteSelect label="Suite B" value={suiteBId} suites={suites} onChange={onSuiteBChange} />
      <div className="comparison-controls__view-options">
        <CompactSelect
          icon={ViewportIcon}
          label="预览视口"
          value={viewport}
          options={[{ id: "desktop", label: "桌面" }, { id: "mobile", label: "移动端" }]}
          onChange={onViewportChange}
        />
        <CompactSelect
          icon={SlidersHorizontal}
          label="组件密度"
          value={density}
          options={[{ id: "comfortable", label: "舒适" }, { id: "compact", label: "紧凑" }]}
          onChange={onDensityChange}
        />
        <CompactSelect
          icon={Sparkle}
          label="组件状态"
          value={visualState}
          options={comparisonStates}
          onChange={onVisualStateChange}
        />
      </div>
    </div>
  );
}
