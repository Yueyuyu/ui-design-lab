export const stateLabels = { default: "默认", hover: "悬停", pressed: "按下", focus: "聚焦", disabled: "禁用", loading: "加载", error: "错误" };

export function StateGrid({ children }) { return <div className="ml-showcase-state-grid">{children}</div>; }
export function StateCell({ state, children }) { return <article className="ml-showcase-state-cell" data-state={state}><span>{stateLabels[state] || state}</span>{children}</article>; }
export function StateSelector({ value, onChange, states = ["default", "loading", "error"] }) { return <div className="ml-showcase-state-selector">{states.map((state) => <button type="button" key={state} data-active={value === state ? "true" : "false"} onClick={() => onChange(state)}>{stateLabels[state] || state}</button>)}</div>; }
