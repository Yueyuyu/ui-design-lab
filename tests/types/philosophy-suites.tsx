import {useState} from 'react';
import {OrchardButton,OrchardDialog,OrchardSettingsWorkspace,OrchardSegmentedControl,OrchardSettingsGroup,OrchardSettingRow,OrchardToggle,OrchardField} from '../../systems/orchard-ui/web/index.js';
import {DialogueChatWorkspace,DialogueComposer,DialogueMessage,DialogueConversationList,DialogueButton,DialogueDialog} from '../../systems/dialogue-ui/web/index.js';

export function PhilosophyConsumer(){
 const [text,setText]=useState(''),[on,setOn]=useState(false),[density,setDensity]=useState('comfortable');
 return <><OrchardSettingsWorkspace onSave={async(values,{signal})=>{if(signal.aborted)throw new Error('已取消');return {...values,name:values.name.trim()};}}/>
 <OrchardSettingsGroup title="设置"><OrchardSettingRow title="通知"><OrchardToggle label="启用" checked={on} onChange={setOn}/></OrchardSettingRow></OrchardSettingsGroup>
 <OrchardField label="名称" value={text} onChange={event=>setText(event.target.value)}/><OrchardSegmentedControl options={[{value:'comfortable',label:'舒适'}]} value={density} onChange={setDensity}/>
 <OrchardDialog open={on} onOpenChange={setOn} title="示例" loading={false}><OrchardButton onClick={()=>setOn(false)}>关闭</OrchardButton></OrchardDialog>
 <DialogueChatWorkspace onSend={async(prompt,{signal,messages,conversationId})=>{if(signal.aborted)throw new Error('已取消');return `${conversationId}: ${messages.length} ${prompt}`;}}/>
 <DialogueComposer value={text} onChange={setText} onSend={()=>{}} onFiles={files=>files.map(file=>file.name)}/>
 <DialogueMessage role="assistant">纯文本</DialogueMessage><DialogueConversationList items={[]} value="" onChange={setText}/>
 <DialogueDialog open={on} onOpenChange={setOn} title="示例"><DialogueButton>确认</DialogueButton></DialogueDialog></>;
}
