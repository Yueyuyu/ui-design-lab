import {useState} from 'react';
import {Bell, Gear, ShieldCheck} from '@phosphor-icons/react';
import * as Kit from '../web/index.js';
import {iconExamples} from './IconExamples.jsx';

function Example({entry,state='default'}) {
 const [value,setValue]=useState('comfortable'),[checked,setChecked]=useState(true);
 const C=Kit[entry.exportName],options=[{value:'comfortable',label:'舒适'},{value:'compact',label:'紧凑'}];
 if(entry.suffix==='SettingsWorkspace')return <C/>;
 if(entry.suffix==='SegmentedControl')return <C disabled={state==='disabled'} options={options} value={value} onChange={setValue}/>;
 if(entry.suffix==='NavigationList')return <C items={[{id:'comfortable',label:'通用',icon:Gear},{id:'compact',label:'隐私',icon:ShieldCheck}]} value={value} onChange={setValue}/>;
 if(entry.suffix==='SettingRow')return <C title="任务通知" description="完成后及时提醒" icon={Bell}><Kit.OrchardToggle disabled={state==='disabled'} loading={state==='loading'} error={state==='error'?'未能更新，请重试':undefined} label="启用通知" checked={checked} onChange={setChecked}/></C>;
 return <Kit.OrchardSettingsGroup title="工作偏好" description="更改会立即反映在此预览中。"><Kit.OrchardSettingRow title="任务通知" icon={Bell}><Kit.OrchardToggle disabled={state==='disabled'} loading={state==='loading'} error={state==='error'?'未能更新，请重试':undefined} label="通知开关" checked={checked} onChange={setChecked}/></Kit.OrchardSettingRow><Kit.OrchardSettingRow title="内容密度"><Kit.OrchardSegmentedControl options={options} value={value} onChange={setValue}/></Kit.OrchardSettingRow></Kit.OrchardSettingsGroup>;
}
export const componentExamples={...Object.fromEntries(['SegmentedControl','NavigationList','SettingRow','SettingsGroup','SettingsWorkspace'].map(name=>['Orchard'+name,Example])),...iconExamples};
