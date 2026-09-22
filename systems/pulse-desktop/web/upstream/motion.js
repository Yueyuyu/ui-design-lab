// Pulse FloatingUsagePanelView.CardReveal：spring(response:0.34,dampingFraction:0.82)。
// Web Animations 采样同一阻尼弹簧；不安装额外动画库、不改为自创 bounce。
export function revealPanel(element, side, entering=true) {
  if(!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const omega=2*Math.PI/.34,zeta=.82,wd=omega*Math.sqrt(1-zeta*zeta);
  const keyframes=Array.from({length:31},(_,i)=>{
    const t=i/30*.6;
    const spring=1-Math.exp(-zeta*omega*t)*(Math.cos(wd*t)+zeta/Math.sqrt(1-zeta*zeta)*Math.sin(wd*t));
    const p=entering?spring:1-spring;
    return {offset:i/30,opacity:Math.max(0,Math.min(1,p)),transform:`translateX(${(1-p)*10*(side==='right'?1:-1)}px) scale(${.88+.12*p})`};
  });
  element.style.transformOrigin=side==='right'?'100% 40px':'0 40px';
  return element.animate(keyframes,{duration:600,easing:'linear'});
}

