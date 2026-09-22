import {useLayoutEffect} from 'react';
export const sendHost=message=>window.chrome?.webview?.postMessage(message);
export function useWindowLayout(root,mode,side,scale) {
  useLayoutEffect(()=>{
    const report=()=>{
      if(!root.current)return;
      const r=root.current.getBoundingClientRect(),dock=root.current.querySelector('.pd-dock');
      if(!dock)return;
      sendHost({type:'size',width:Math.ceil(r.width+12*scale),height:Math.ceil(r.height+12*scale),mode,side,scale,attached:dock.dataset.attached==='true',railHeight:parseFloat(dock.querySelector('.pd-rail')?.style.height)||102,panelOffset:parseFloat(dock.querySelector('.pd-panel')?.style.marginTop)||0,railPath:dock.querySelector('.pd-rail-shape path')?.getAttribute('d')??null,panelPath:dock.querySelector('.pd-panel-shape path')?.getAttribute('d')??null});
    };
    const observer=new ResizeObserver(report),paths=new MutationObserver(report);
    observer.observe(root.current);
    const dock=root.current.querySelector('.pd-dock');
    if(dock)observer.observe(dock);
    // 不观察机器人的逐帧路径，避免动画触发窗口重裁切及位置写盘。
    root.current.querySelectorAll('.pd-panel-shape path,.pd-rail-shape path').forEach(path=>paths.observe(path,{attributes:true,attributeFilter:['d']}));
    const element=root.current;element.addEventListener('pulse:layout',report);
    report();return ()=>{observer.disconnect();paths.disconnect();element.removeEventListener('pulse:layout',report);};
  },[root,mode,side,scale]);
}
