import { recordEvent } from "../telemetry.js";
import { useState } from "react";
import { getSuiteById } from "../../registry/suites.js";
import { defaults, validateTheme, themeCSS, contrast } from "./theme-config.js";
import { downloadText } from "./demo-data.js";
import { copyText } from "../copyText.js";
export function ThemeEditor({
  ui: U,
  suiteId
}) {
  const suite = getSuiteById(suiteId);
  const [history, setHistory] = useState(() => {
      try {
        const shared = new URLSearchParams(location.hash.split("?")[1]).get("theme");
        if (shared) return [validateTheme(JSON.parse(shared), suite)];
      } catch {}
      return [defaults(suite)];
    }),
    [position, setPosition] = useState(0),
    [message, setMessage] = useState(""),
    [json, setJSON] = useState(""),
    [dialog, setDialog] = useState(false);
  const theme = history[position],
    controls = suite.themeControls ?? [];
  const commit = next => {
    setHistory(v => [...v.slice(0, position + 1), next]);
    setPosition(position + 1);
  };
  const read = raw => {
    try {
      commit(validateTheme(JSON.parse(raw), suite));
      setMessage("主题已载入");
    } catch (e) {
      setMessage(e.message);
    }
  };
  const textColor = controls.find(c => c.role === "text"),
    surfaceColor = controls.find(c => c.role === "surface"),
    brandColor = controls.find(c => c.role === "brand");
  const pairs = textColor && surfaceColor ? [["正文 / 面板", theme.values[textColor.token], theme.values[surfaceColor.token]], ...(brandColor ? [["品牌色 / 面板", theme.values[brandColor.token], theme.values[surfaceColor.token]]] : [])] : [];
  return <section className="theme-editor"><h1>主题编辑器</h1><p>套系 {suite.displayName} v{suite.version} · 用户主题独立保存；调整不会覆盖官方基础 Token。</p><div className="theme-editor-layout"><aside><h2>主题设置</h2>
 {controls.map(c => <label key={c.token}>{c.label}{c.type === "font" ? <select value={theme.values[c.token]} onChange={e => commit({
            ...theme,
            values: {
              ...theme.values,
              [c.token]: e.target.value
            }
          })}>{c.options.map(v => <option key={v}>{v}</option>)}</select> : <input type={c.type === "color" ? "color" : "range"} min={0} max={24} value={c.type === "radius" ? parseInt(theme.values[c.token]) : theme.values[c.token]} onChange={e => commit({
            ...theme,
            values: {
              ...theme.values,
              [c.token]: e.target.value + (c.type === "radius" ? "px" : "")
            }
          })} />}<small>{theme.values[c.token]}</small></label>)}
 <label>组件密度<select value={theme.density} onChange={e => commit({
            ...theme,
            density: e.target.value
          })}>{suite.densities.map(v => <option key={v}>{v}</option>)}</select></label>
 <div className="workbench-actions"><button type="button" disabled={!position} onClick={() => setPosition(position - 1)}>撤销</button><button type="button" disabled={position === history.length - 1} onClick={() => setPosition(position + 1)}>重做</button><button type="button" onClick={() => commit(defaults(suite))}>恢复默认</button><button type="button" onClick={() => {
            try {
              localStorage.setItem("ui-lab-theme:" + suiteId, JSON.stringify(theme));
              setMessage("主题已保存到本机");
            } catch {
              setMessage("本地保存失败，请导出 JSON");
            }
          }}>保存主题</button><button type="button" onClick={() => {
            try {
              read(localStorage.getItem("ui-lab-theme:" + suiteId) ?? "null");
            } catch {
              setMessage("本地存储不可用，请导入 JSON");
            }
          }}>恢复保存</button></div>
 <h3>局部可读性检查</h3>{pairs.map(([label, a, b]) => <p key={label}>{label}：{contrast(a, b).toFixed(2)}:1 · {contrast(a, b) >= 4.5 ? "满足普通文本 AA 对比度" : "普通文本对比度不足"}</p>)}<p>这里只检查声明的颜色组合，不代表全站无障碍验收。</p>
 </aside><div><div data-ui-system={suiteId} data-theme="custom" data-theme-preview data-density={theme.density} style={theme.values} className="theme-preview"><U.Panel title="跨场景预览"><U.Field label="项目名称" defaultValue="品牌研究" /><U.Button onClick={() => setDialog(true)}>打开主题弹窗</U.Button><U.Chart title="周度处理量" unit="项" data={[{
              label: "周一",
              value: 10
            }, {
              label: "周二",
              value: 16
            }, {
              label: "周三",
              value: 12
            }]} /><U.DataTable rows={[{
              id: "1",
              name: "研究项目",
              status: "进行中"
            }, {
              id: "2",
              name: "内容归档",
              status: "已完成"
            }]} columns={[{
              key: "name",
              label: "项目"
            }, {
              key: "status",
              label: "状态"
            }]} /></U.Panel><U.Drawer open={dialog} onOpenChange={setDialog} title="主题详情预览"><U.Field label="展示名称" defaultValue="我的品牌" /><U.Button onClick={() => setDialog(false)}>确认并关闭</U.Button></U.Drawer></div>
 <div className="workbench-actions"><button type="button" onClick={() => {
            downloadText(suiteId + "-theme.json", JSON.stringify(theme, null, 2), "application/json");
            recordEvent("theme_export", {
              suiteId
            });
          }}>导出 JSON</button><button type="button" onClick={() => {
            downloadText(suiteId + "-theme.css", themeCSS(theme), "text/css");
            recordEvent("theme_export", {
              suiteId
            });
          }}>导出 CSS</button><button type="button" onClick={() => setJSON(JSON.stringify(theme, null, 2))}>显示配置</button><button type="button" onClick={async () => {
            try {
              const url = new URL(location.href);
              url.hash = "systems/" + suiteId + "/theme?theme=" + encodeURIComponent(JSON.stringify(theme));
              await copyText(url.href);
              setMessage("主题分享链接已复制（只含主题配置）");
            } catch {
              setMessage("复制失败，请导出 JSON");
            }
          }}>复制主题分享链接</button></div>
 <label>主题 JSON<textarea aria-label="主题 JSON" value={json} onChange={e => setJSON(e.target.value)} rows={7} /></label><button type="button" onClick={() => read(json)}>导入 JSON</button><pre>{themeCSS(theme)}</pre><p>应用 CSS 时给套系根元素添加 data-theme="custom"，密度使用 data-density="{theme.density}"。</p>
 </div></div><p role="status">{message}</p></section>;
}
