export function ThemeControls({ui:U,suite,theme,onChange}) {
  const update=(token,value)=>onChange({...theme,values:{...theme.values,[token]:value}});
  return <div className="theme-control-list">{suite.themeControls.map(control=><div className="theme-control" key={control.token}>
    {control.type==='radius'?<U.Slider label={control.label} value={parseInt(theme.values[control.token])} min={0} max={24} unit="px" onChange={value=>update(control.token,value+'px')}/>:control.type==='font'?<U.Select label={control.label} value={theme.values[control.token]} options={control.options.map(value=>({value,label:value.startsWith('Inter')?'Inter':value.startsWith('system')?'系统字体':'Segoe UI'}))} onChange={event=>update(control.token,event.target.value)}/>:<div className="theme-color-control"><U.Field type="color" label={control.label} value={theme.values[control.token]} onChange={event=>update(control.token,event.target.value)}/><code>{theme.values[control.token]}</code></div>}
  </div>)}<U.Select label="组件密度" value={theme.density} options={suite.densities.map(value=>({value,label:value==='compact'?'紧凑':'舒适'}))} onChange={event=>onChange({...theme,density:event.target.value})}/></div>;
}
