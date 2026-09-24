import {useEffect,useState} from 'react';
import {WorkflowDemo} from './WorkflowDemo.jsx';
const kinds=['tasks','research','reports'];
function readKind(){const value=new URLSearchParams(location.hash.split('?')[1]).get('kit');return kinds.includes(value)?value:'tasks';}
export function WorkflowGallery(props) {
 const [kind,setKind]=useState(readKind);
 // 同一套系下切换场景地址不会卸载页面，必须同步 URL 中的场景选择。
 useEffect(()=>{const update=()=>setKind(readKind());window.addEventListener('hashchange',update);window.addEventListener('popstate',update);return()=>{window.removeEventListener('hashchange',update);window.removeEventListener('popstate',update);};},[]);
 const select=value=>{setKind(value);const [route,search]=location.hash.split('?');const query=new URLSearchParams(search);query.set('kit',value);history.replaceState(null,'',`${route}?${query}`);};
 return <section><h1>完整场景工作台</h1><p>用真实交互检查连续页面、错误恢复与数据一致性。</p><label>场景包 <select value={kind} onChange={event=>select(event.target.value)}><option value="tasks">任务与用量</option><option value="research">研究与内容</option><option value="reports">运营分析与报表</option></select></label><WorkflowDemo key={kind} {...props} kind={kind}/></section>;
}
