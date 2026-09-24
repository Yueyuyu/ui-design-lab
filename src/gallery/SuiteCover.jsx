import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LoadBoundary } from "./LoadBoundary.jsx";
export const coverDimensions = { width: 1140, height: 720 };
export function SuiteCover({ suite, presentation = "components" }) {
  if (presentation === "scene" && suite.scenePreviewUrl) {
    return <div className="suite-cover suite-cover--scene"><img className="suite-cover__image" src={suite.scenePreviewUrl} alt={`${suite.displayName} 场景概念：${suite.selection.scenePreview.title}`} width={coverDimensions.width} height={coverDimensions.height} loading="lazy" decoding="async" /></div>;
  }
  return <ComponentCover suite={suite} />;
}

// 组件封面继续供原有导出入口使用；场景封面不会改变套系的真实组件预览。
function ComponentCover({ suite }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const Cover = useMemo(() => suite.loadCover ? lazy(suite.loadCover) : null, [suite.loadCover]);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="suite-cover" role="img" aria-label={`${suite.displayName} 图标与真实组件精选预览`}>
    <div className="suite-cover__canvas" aria-hidden="true" inert data-ui-system={suite.id} data-density="compact" style={{ width: coverDimensions.width, height: coverDimensions.height, transform: `scale(${width / coverDimensions.width})` }}>
      {Cover ? <LoadBoundary><Suspense fallback={<p>正在加载预览…</p>}><Cover /></Suspense></LoadBoundary> : <p>该套系尚未提供组件预览。</p>}
    </div>
  </div>;
}
