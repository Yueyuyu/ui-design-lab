import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LoadBoundary } from "./LoadBoundary.jsx";
export function SuiteCover({suite}) {
 const ref=useRef(null),[width,setWidth]=useState(400);
 const Cover=useMemo(()=>suite.loadCover?lazy(suite.loadCover):null,[suite.loadCover]);
 useLayoutEffect(()=>{const observer=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[]);
 return <div ref={ref} className="suite-cover" role="img" aria-label={suite.displayName+" 真实组件：工作台导航、项目概览和表单"}>
  <div className="suite-cover__canvas" aria-hidden="true" inert data-ui-system={suite.id} data-density="compact" style={{width:800,height:400,left:(width-800*Math.min(width/800,.5))/2,transform:"scale("+Math.min(width/800,.5)+")"}}>
   {Cover?<LoadBoundary><Suspense fallback={<p>正在加载预览…</p>}><Cover/></Suspense></LoadBoundary>:<p>该套系尚未提供组件封面。</p>}
  </div>
 </div>;
}
