import { useState } from "react";
import { lineCoordinates, validSeries, barGeometry } from "./chart-data.js";
function Message({ state, invalid, onRetry }) {
  return <div className="ml-line-chart__error" role={state === "error" || invalid ? "alert" : "status"}>
    <span>{state === "loading" ? "正在加载数据…" : invalid ? "数据包含缺失或非法数值，请检查数据源。" : state === "error" ? "数据加载失败，当前输入仍保留。" : "当前条件下暂无数据。"}</span>
    {state === "error" && onRetry ? <button type="button" onClick={onRetry}>重新加载</button> : null}
  </div>;
}
export function LedgerLineChart({ title = "趋势", value, data = [], labels = [], unit = "", description, period, source, updatedAt, state = "default", onRetry }) {
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(true);
  const invalid = !validSeries(data);
  const points = lineCoordinates(data);
  const ready = !invalid && points.length > 0 && !["empty","loading","error"].includes(state);
  const selected = points[active] ?? points.at(-1);
  return <figure className="ml-line-chart" data-state={state} aria-busy={state === "loading" || undefined}>
    <figcaption><span><strong>{title}</strong><small>{[description,period,source,updatedAt].filter(Boolean).join(" · ")}</small></span><b>{ready ? value ?? data.at(-1) + unit : "—"}</b></figcaption>
    <button type="button" className="ml-chart-legend" aria-pressed={visible} disabled={!ready || state === "disabled"} onClick={() => setVisible(!visible)}>{visible ? "隐藏" : "显示"} {title}</button>
    <div className="ml-line-chart__plot">
      {!ready ? <Message state={state} invalid={invalid} onRetry={onRetry}/> : visible ? <svg viewBox="0 0 640 220" role="group" aria-label={title} preserveAspectRatio="none">
        <polyline points={points.map(p => p.x + "," + p.y).join(" ")}/>
        {points.map((point,index) => <circle key={index} cx={point.x} cy={point.y} r={active === index ? 7 : 4} tabIndex={state === "disabled" ? -1 : 0} role="img" aria-label={(labels[index] ?? "第 " + (index+1) + " 项") + "：" + point.value + unit} onFocus={() => setActive(index)} onMouseEnter={() => setActive(index)}><title>{labels[index] ?? index+1}：{point.value}{unit}</title></circle>)}
      </svg> : <p>系列已隐藏，可通过图例重新显示。</p>}
    </div>
    {ready && visible ? <p className="ml-chart-summary" role="status">{labels[active ?? data.length-1] ?? "第 " + ((active ?? data.length-1)+1) + " 项"}：{selected.value}{unit} · 最低 {Math.min(...data)}{unit} / 最高 {Math.max(...data)}{unit}</p> : null}
  </figure>;
}
export function LedgerBarChart({ values, data, title = "数据分布", unit = "", description, period, source, updatedAt, state = "default", onRetry }) {
  const rows = data ?? (values?.map((value,index) => ({label:String(index+1),value})) ?? []);
  const invalid = !validSeries(rows);
  const bars = barGeometry(rows);
  const ready = !invalid && bars.length > 0 && !["empty","loading","error"].includes(state);
  return <figure className="ml-bar-chart" data-state={state} aria-busy={state === "loading" || undefined}>
    <figcaption>{title}<small>{[description,period,source,updatedAt].filter(Boolean).join(" · ")}</small></figcaption>
    {!ready ? <Message state={state} invalid={invalid} onRetry={onRetry}/> : <div className="ml-signed-bars">{bars.map((item,index) => <button type="button" key={index} disabled={state === "disabled"} aria-label={item.label + "：" + item.value + unit}>
      <b>{item.value}{unit}</b><span className="ml-signed-track"><i style={{top:item.top+"%",height:item.height+"%"}} data-negative={item.value < 0}/><hr style={{top:item.baseline+"%"}}/></span><small>{item.label}</small>
    </button>)}</div>}
  </figure>;
}
