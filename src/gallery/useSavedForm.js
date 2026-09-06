import { useEffect, useRef, useState } from "react";
export function useSavedForm(key, initial) {
  const [saved, setSaved] = useState(() => { try { const value = JSON.parse(localStorage.getItem(key)); return value && typeof value.name === "string" && typeof value.notifications === "boolean" && typeof value.workspace === "string" ? value : initial; } catch { return initial; } });
  const [draft, setDraft] = useState(saved), [status, setStatus] = useState("idle"), [error, setError] = useState("");
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; },[]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => { const warn = e => { if (dirty) { e.preventDefault(); e.returnValue = ""; } }; window.addEventListener("beforeunload",warn); return () => window.removeEventListener("beforeunload",warn); },[dirty]);
  const save = async (fail = false) => {
    if (status === "saving") return false;
    if (!draft.name.trim()) { setError("请输入名称。"); setStatus("error"); return false; }
    setStatus("saving"); setError("");
    await new Promise(resolve => setTimeout(resolve,450));
    if (!alive.current) return false;
    try {
      if (fail) throw new Error("模拟保存失败：输入已保留，可点击重试。");
      localStorage.setItem(key,JSON.stringify(draft)); setSaved({...draft}); setStatus("saved"); return true;
    } catch (e) { setStatus("error"); setError(e.message || "本地存储不可用，请导出或重试。"); return false; }
  };
  return { draft, dirty, status, error, save, update: (field,value) => { setDraft(d => ({...d,[field]:value})); setStatus("idle"); setError(""); }, cancel: () => { setDraft({...saved}); setStatus("idle"); setError(""); } };
}
