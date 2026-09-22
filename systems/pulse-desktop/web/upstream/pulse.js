// 移植 Pulse 2e17225 的 BotMarkTint / Persona / DockLayout；Apache-2.0，见 ../../licenses/。
export const metrics = Object.freeze({ railWidth:64, ringDiameter:36, ringLineWidth:4, botSize:28, endPadding:22, labelGap:6, labelHeight:16, sliverWidth:6, sliverHeight:96 });
export const personas = ['calm','eager','steady','curious','sleepy','playful','stoic','proud'];
export function personaConfig(persona, mood) {
  const tempo = ['eager','playful'].includes(persona) ? .85 : persona === 'sleepy' ? 1.5 : persona === 'stoic' ? 1.25 : 1;
  return { tempo:tempo * (mood === 'working' ? .5 : mood === 'loading' ? .7 : 1), motionScale:persona === 'playful' ? 1.15 : persona === 'eager' ? 1.1 : persona === 'sleepy' ? .8 : persona === 'stoic' ? .6 : 1,
    gazeScale:['curious','eager'].includes(persona) ? 1.2 : persona === 'stoic' ? .5 : persona === 'sleepy' ? .7 : 1,
    eyeScale:['eager','curious'].includes(persona) ? 1.06 : persona === 'stoic' ? .94 : 1 };
}
export function dealtColor(index = 0) {
  const h = ((27 + 36 * index) % 360) / 60, saturation = .68;
  let low=0, high=1, rgb;
  for(let i=0;i<20;i++) {
    const l=(low+high)/2,c=(1-Math.abs(2*l-1))*saturation,x=c*(1-Math.abs(h%2-1)),m=l-c/2;
    rgb=(h<1?[c,x,0]:h<2?[x,c,0]:h<3?[0,c,x]:h<4?[0,x,c]:h<5?[x,0,c]:[c,0,x]).map(v=>v+m);
    if(.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]<.62) low=l; else high=l;
  }
  return '#' + rgb.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');
}
export function berthPath(width=64,height=150,openness=1) {
  const f=Math.min(24*openness,height/2),r=Math.max(Math.min(6+20*openness,Math.min(width,(height-2*f)/2)),0),fw=Math.max(Math.min(38*openness,width-r),0),k=.55;
  let d=`M ${r} ${f} L ${width-fw} ${f} C ${width-fw*(1-k)} ${f} ${width} ${f*k} ${width} 0 L ${width} ${height} C ${width} ${height-f*k} ${width-fw*(1-k)} ${height-f} ${width-fw} ${height-f} L ${r} ${height-f}`;
  for(const [cx,cy,start] of [[r,height-f-r,Math.PI/2],[r,f+r,Math.PI]]) {
    for(let i=0;i<=48;i++) {const a=start+i/48*Math.PI/2,c=Math.cos(a),s=Math.sin(a);d+=` L ${cx+r*Math.sign(c)*Math.sqrt(Math.abs(c))} ${cy+r*Math.sign(s)*Math.sqrt(Math.abs(s))}`;}
  }
  return d+' Z';
}

// UsageBubbleShape 的 flank 原值；body 和 pointer 在同一 SVG path 内填充。
export function bubblePath(width, height, side = 'right', centre = 40) {
  const r=20,pw=20,half=20,left=side==='left',x=left?pw:0,w=width-pw;
  const c=Math.min(Math.max(centre,r+half),Math.max(height-r-half,r+half));
  const base=left?x:x+w,tip=left?0:width,reach=tip-base,sweep=left?-half:half;
  // Windows 无 SwiftUI continuous roundedRect，用 Pulse DockBerth 同一 n=4 采样。
  let body=`M ${x+r} 0 H ${x+w-r}`;
  for(const [cx,cy,start] of [[x+w-r,r,-Math.PI/2],[x+w-r,height-r,0],[x+r,height-r,Math.PI/2],[x+r,r,Math.PI]]) {
    for(let i=0;i<=48;i++) {const a=start+i/48*Math.PI/2,c=Math.cos(a),s=Math.sin(a);body+=` L ${cx+r*Math.sign(c)*Math.sqrt(Math.abs(c))} ${cy+r*Math.sign(s)*Math.sqrt(Math.abs(s))}`;}
  }
  body+=' Z';
  return body+` M ${base} ${c-sweep} C ${base+reach*.24} ${c-sweep*.44} ${base+reach*.55} ${c-sweep*.24} ${tip} ${c} C ${base+reach*.55} ${c+sweep*.24} ${base+reach*.24} ${c+sweep*.44} ${base} ${c+sweep} L ${base-reach*.08} ${c+sweep} L ${base-reach*.08} ${c-sweep} Z`;
}
