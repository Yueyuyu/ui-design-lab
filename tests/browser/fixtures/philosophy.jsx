import {useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as Orchard from '../../../systems/orchard-ui/web/index.js';
import * as Dialogue from '../../../systems/dialogue-ui/web/index.js';
import '../../../systems/orchard-ui/foundations/tokens.css';
import '../../../systems/orchard-ui/web/components.css';
import '../../../systems/dialogue-ui/foundations/tokens.css';
import '../../../systems/dialogue-ui/web/components.css';

function Fixture() {
  const [suite,setSuite]=useState('orchard-ui'),[mounted,setMounted]=useState(true),[open,setOpen]=useState(false),[blocked,setBlocked]=useState(false),[value,setValue]=useState('one');
  const pending=useRef([]),[count,setCount]=useState(0),[aborted,setAborted]=useState(0);
  const Kit=suite==='orchard-ui'?Orchard:Dialogue,prefix=suite==='orchard-ui'?'Orchard':'Dialogue';
  const Button=Kit[prefix+'Button'],Dialog=Kit[prefix+'Dialog'],Menu=Kit[prefix+'DropdownMenu'],Tabs=Kit[prefix+'Tabs'],Segment=Kit[prefix+'SegmentedControl'];
  // 故意不在 abort 时结束 Promise，验证服务无视取消时页面仍能拒绝迟到结果。
  function enqueue(input,{signal}) {return new Promise(resolve=>{signal.addEventListener('abort',()=>setAborted(n=>n+1),{once:true});pending.current.push(()=>resolve(typeof input==='string'?'迟到回复：'+input:{...input,name:'迟到保存'}));setCount(pending.current.length);});}
  function resolveNext(){pending.current.shift()?.();setCount(pending.current.length);}
  return <><label>验收套系<select value={suite} onChange={event=>setSuite(event.target.value)}><option value="orchard-ui">Orchard</option><option value="dialogue-ui">Dialogue</option></select></label><button onClick={resolveNext}>返回最早请求</button><button onClick={()=>setMounted(!mounted)}>切换挂载</button><output>待返回 {count} / 已中止 {aborted}</output>
    <section data-ui-system={suite} data-density="comfortable" key={suite} style={{maxWidth:1100,margin:'20px auto'}}>
      <Button onClick={()=>setOpen(true)}>打开验收模态</Button><label><input type="checkbox" checked={blocked} onChange={event=>setBlocked(event.target.checked)}/>模态忙碌</label>
      <Dialog open={open} onOpenChange={setOpen} title="验收模态" loading={blocked} footer={<Button>模态保存</Button>}><input aria-label="模态输入"/></Dialog>
      <Menu items={[{id:'one',label:'第一项'},{id:'skip',label:'禁用项',disabled:true},{id:'two',label:'最后一项'}]}/>
      <Tabs items={[{id:'one',label:'第一视图',content:'第一视图正文'},{id:'skip',label:'禁用视图',disabled:true},{id:'two',label:'第二视图',content:'第二视图正文'}]} value={value} onChange={setValue}/>
      <Segment label="验收密度" options={[{value:'one',label:'舒适'},{value:'skip',label:'禁用',disabled:true},{value:'two',label:'紧凑'}]} value={value} onChange={setValue}/>
      {mounted&&(suite==='orchard-ui'?<Orchard.OrchardSettingsWorkspace onSave={enqueue}/>:<Dialogue.DialogueChatWorkspace onSend={enqueue}/>)}
    </section></>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);
