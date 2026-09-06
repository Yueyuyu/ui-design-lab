export function defaults(suite) { return {schemaVersion:1,suiteId:suite.id,suiteVersion:suite.version,density:suite.densities[0],values:Object.fromEntries((suite.themeControls??[]).map(c=>[c.token,c.default]))}; }
export function validateTheme(value,suite) {
 if(!value||value.schemaVersion!==1||value.suiteId!==suite.id||value.suiteVersion!==suite.version||!suite.densities.includes(value.density)||!value.values||typeof value.values!=="object")throw Error("主题套系、版本或密度不匹配。");
 const controls=suite.themeControls??[];
 if(Object.keys(value.values).length!==controls.length||Object.keys(value.values).some(k=>!controls.some(c=>c.token===k)))throw Error("主题含未支持的 Token。");
 for(const c of controls){const v=value.values[c.token];if(typeof v!=="string"||(c.type==="color"&&!/^#[0-9a-f]{6}$/i.test(v))||(c.type==="radius"&&!/^(0|[1-9]|1[0-9]|2[0-4])px$/.test(v))||(c.type==="font"&&!c.options.includes(v)))throw Error("无效主题值："+c.label);}
 return {schemaVersion:1,suiteId:suite.id,suiteVersion:suite.version,density:value.density,values:{...value.values}};
}
export function contrast(a,b) {
 const luminance=color=>{const parts=color.slice(1).match(/.{2}/g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return parts[0]*.2126+parts[1]*.7152+parts[2]*.0722;};
 const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
export function themeCSS(theme) { return '[data-ui-system="'+theme.suiteId+'"][data-theme="custom"] {\n'+Object.entries(theme.values).map(([key,value])=>"  "+key+": "+value+";").join("\n")+"\n}\n"; }
