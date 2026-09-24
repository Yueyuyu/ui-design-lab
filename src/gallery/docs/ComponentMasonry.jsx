import {useLayoutEffect,useRef} from 'react';

// 保留 DOM 和键盘浏览顺序，仅按实际高度分配网格行；不使用 dense 回填打乱顺序。
export function ComponentMasonry({children}) {
 const ref=useRef(null);
 useLayoutEffect(()=>{
  const list=ref.current;
  if(!list || typeof ResizeObserver==='undefined') return;
  const items=[...list.children];
  let frame;
  const measure=()=>{
   const gap=parseFloat(getComputedStyle(list).getPropertyValue('--doc-masonry-gap')) || 16;
   // 先集中读取自然高度，再更新跨度，避免逐项读写触发布局抖动。
   const heights=items.map(item=>item.getBoundingClientRect().height);
   items.forEach((item,index)=>{
    const span=`span ${Math.ceil(heights[index]+gap)}`;
    if(item.style.gridRowEnd!==span) item.style.gridRowEnd=span;
   });
   list.dataset.masonry='ready';
  };
  const observer=new ResizeObserver(()=>{
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(measure);
  });
  measure();
  // 图片加载、内容展开、字体和预览宽度变化均会重新测量；组件不会被重新挂载。
  items.forEach(item=>observer.observe(item));
  observer.observe(list);
  return ()=>{
   observer.disconnect();
   cancelAnimationFrame(frame);
   delete list.dataset.masonry;
   items.forEach(item=>item.style.removeProperty('grid-row-end'));
  };
 },[children]);
 return <ul className="doc-index-list" ref={ref}>{children}</ul>;
}
