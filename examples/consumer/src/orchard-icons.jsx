import {useState} from 'react';
import {OrchardAppLauncher,OrchardIconPicker,OrchardSymbol,OrchardAppIcon,OrchardCommandMenu} from 'ui-design-lab/orchard-ui';
import filesArtwork from 'ui-design-lab/orchard-ui/assets/orchard-files.png';
import musicArtwork from 'ui-design-lab/orchard-ui/assets/orchard-music.png';
export function OrchardIconsConsumer(){
 const [value,setValue]=useState('folder'),[action,setAction]=useState('等待操作');
 return <section aria-label="图标组件消费验收"><OrchardSymbol name={value} label="当前符号"/><OrchardAppIcon src={filesArtwork} label="资料图像"/><OrchardIconPicker value={value} onChange={setValue}/><OrchardAppLauncher items={[{id:'files',name:'资料',src:filesArtwork},{id:'music',name:'音乐',src:musicArtwork}]} onLaunch={item=>setAction(item.name)}/><OrchardCommandMenu items={[{id:'new',label:'新建笔记',symbol:'notes'}]} onSelect={item=>setAction(item.label)}/><output>{action}</output></section>;
}
