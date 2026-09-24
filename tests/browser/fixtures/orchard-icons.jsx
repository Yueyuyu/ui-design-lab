import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {OrchardAppIcon,OrchardAppLauncher,OrchardCommandMenu,OrchardIconPicker} from '../../../systems/orchard-ui/web/index.js';
import '../../../systems/orchard-ui/foundations/tokens.css';
import '../../../systems/orchard-ui/web/components.css';
import filesArtwork from '../../../systems/orchard-ui/assets/orchard-files.png';

function IconsFixture() {
 const [value,setValue]=useState('folder'),[state,setState]=useState('default'),[action,setAction]=useState('尚未执行'),[src,setSrc]=useState('data:image/png;base64,broken');
 const boundary={disabled:state==='disabled',loading:state==='loading',error:state==='error'?'保存失败，当前选择已保留':undefined};
 return <main data-ui-system="orchard-ui" style={{maxWidth:900,margin:'24px auto'}}>
  <label>验收状态<select value={state} onChange={event=>setState(event.target.value)}>{['default','disabled','loading','error'].map(item=><option key={item}>{item}</option>)}</select></label>
  <output aria-label="选择结果">{value}</output><output aria-label="执行结果">{action}</output>
  <OrchardIconPicker value={value} onChange={setValue} {...boundary}/>
  <OrchardAppLauncher items={[{id:'files',name:'资料',symbol:'folder',src:filesArtwork},{id:'mail',name:'邮件',symbol:'mail',badge:'3'},{id:'locked',name:'暂不可用',disabled:true}]} onLaunch={item=>setAction(item.id)} {...boundary}/>
  <OrchardCommandMenu items={[{id:'note',label:'新建笔记'},{id:'locked',label:'暂不可执行',disabled:true},{id:'settings',label:'偏好设置'}]} onSelect={item=>setAction(item.id)} {...boundary}/>
  <OrchardAppIcon src={src} symbol="folder" label="图像回退"/><button onClick={()=>setSrc(filesArtwork)}>恢复图像</button>
 </main>;
}
createRoot(document.getElementById('root')).render(<IconsFixture/>);
