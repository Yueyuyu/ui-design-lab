import { barGeometry, validSeries } from "./chart-data.js";
import { SignalButton } from "./primitives.jsx";
export function SignalBarChart({ title, description, data = [], unit = "", period, source, updatedAt, state = "default", disabled = false, onRetry }) {
  const invalid = !validSeries(data), bars = barGeometry(data);
  const ready = !invalid && bars.length > 0 && !["empty","loading","error"].includes(state);
  return <figure className="ss-chart" data-state={disabled ? "disabled" : state} aria-busy={state === "loading" || undefined}>
    <figcaption><span><strong>{title}</strong><small>{[description,period,source,updatedAt].filter(Boolean).join(" · ")}</small></span></figcaption>
    {!ready ? <div className="ss-chart__message" role={invalid || state === "error" ? "alert" : "status"}>
      <span>{state === "loading" ? "正在加载数据…" : invalid ? "数据包含缺失或非法数值，请检查数据源。" : state === "error" ? "图表加载失败。请稍后重试。" : "当前筛选条件下暂无数据。"}</span>
      {state === "error" && onRetry ? <SignalButton onClick={onRetry}>重新加载</SignalButton> : null}
    </div> : <div className="ss-signed-bars">{bars.map((item,index) => <button type="button" key={index} disabled={disabled || state === "disabled"} aria-label={item.label + "：" + item.value + unit}>
      <b>{item.value}{unit}</b><span className="ss-signed-track"><i style={{top:item.top+"%",height:item.height+"%"}} data-negative={item.value < 0}/><hr style={{top:item.baseline+"%"}}/></span><small>{item.label}</small>
    </button>)}</div>}
  </figure>;
}
