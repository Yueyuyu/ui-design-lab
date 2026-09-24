import {useId} from 'react';
export function QuietSlider({label,value,min=0,max=100,step=1,unit='',onChange,hint,error,loading=false,disabled=false}) {
  const id=useId();
  const fill=max>min?Math.min(100,Math.max(0,(value-min)/(max-min)*100)):0;
  return <label className="qw-slider"><span className="qw-slider-heading"><span>{label}</span><output htmlFor={id}>{value}{unit}</output></span><input id={id} type="range" aria-label={label} value={value} min={min} max={max} step={step} disabled={disabled||loading} aria-invalid={!!error} aria-busy={loading||undefined} aria-describedby={error||hint||loading?id+'-hint':undefined} aria-valuetext={value+unit} style={{'--qw-slider-fill':fill+'%'}} onChange={event=>onChange?.(Number(event.target.value))}/>{(error||hint||loading)&&<small id={id+'-hint'} role={error?'alert':loading?'status':undefined}>{error||(loading?'正在读取设置…':hint)}</small>}</label>;
}
