import {useState} from 'react';
import {OrchardSymbol,OrchardAppIcon,OrchardIconPicker,OrchardAppLauncher,OrchardCommandMenu,orchardSymbols,type OrchardSymbolName} from 'ui-design-lab/orchard-ui';
export function IconConsumer(){
 const [value,setValue]=useState<OrchardSymbolName>('folder');
 return <><OrchardSymbol name={value} label="当前图标"/><OrchardAppIcon symbol={value} tone="rose" badge="3"/><OrchardIconPicker value={value} onChange={setValue}/><OrchardAppLauncher items={[{id:'files',name:'资料',symbol:'folder'}]} onLaunch={item=>setValue(item.symbol??'folder')}/><OrchardCommandMenu items={[{id:'new',label:'新建',symbol:'notes'}]} onSelect={item=>setValue(item.symbol??orchardSymbols[0].id)}/></>;
}
