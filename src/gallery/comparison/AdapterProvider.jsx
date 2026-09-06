import { createContext, useContext, useEffect, useState } from "react";

const AdapterContext = createContext({});
const cache = new Map();

export function AdapterProvider({ suiteA, suiteB, children }) {
  const [entries, setEntries] = useState({});
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    for (const suite of new Map([suiteA, suiteB].filter(Boolean).map((item) => [item.id, item])).values()) {
      if (!suite.loadComparison) continue;
      if (cache.has(suite.id)) {
        setEntries((current) => ({ ...current, [suite.id]: { module: cache.get(suite.id) } }));
        continue;
      }
      setEntries((current) => ({ ...current, [suite.id]: { loading: true } }));
      suite.loadComparison().then((module) => {
        if (!module.Scene || !module.Module || !module.Status) throw new Error("比较适配器导出不完整");
        cache.set(suite.id, module);
        if (active) setEntries((current) => ({ ...current, [suite.id]: { module } }));
      }).catch(() => {
        if (active) setEntries((current) => ({ ...current, [suite.id]: { error: true } }));
      });
    }
    return () => { active = false; };
  }, [suiteA, suiteB, attempt]);
  return <AdapterContext.Provider value={{ entries, retry: () => setAttempt((value) => value + 1) }}>{children}</AdapterContext.Provider>;
}

export function useComparisonAdapter(suite) {
  const { entries = {}, retry } = useContext(AdapterContext);
  return { ...entries[suite.id], supported: Boolean(suite.loadComparison), retry };
}

export function AdapterMessage({ suite, adapter, kind, id }) {
  const supported = adapter.supported && suite.comparison?.[kind]?.includes(id);
  if (!supported) return <div className="comparison-unsupported"><strong>{suite.displayName} 尚未支持此{kind === "scenarios" ? "场景" : "模块"}</strong><p>可进入套系查看已实现能力。</p></div>;
  if (adapter.error) return <div className="comparison-unsupported" role="alert"><strong>比较组件加载失败</strong><button type="button" onClick={adapter.retry}>重新加载比较组件</button></div>;
  return <div className="comparison-unsupported" role="status">正在加载 {suite.displayName} 的比较组件…</div>;
}
