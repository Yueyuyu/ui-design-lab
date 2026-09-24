import {useState} from 'react';
import * as Kit from '../web/index.js';

function Example({entry,state='default'}) {
 const [text,setText]=useState('帮我把想法整理得更清楚'),[value,setValue]=useState('one'),[message,setMessage]=useState('');
 const C=Kit[entry.exportName];
 if(entry.suffix==='ChatWorkspace')return <C/>;
 let content;
 if(entry.suffix==='SegmentedControl')content=<C disabled={state==='disabled'} label="回答长度" options={[{value:'one',label:'简洁'},{value:'two',label:'详细'}]} value={value} onChange={setValue}/>;
 if(entry.suffix==='Message')content=<C loading={state==='loading'} error={state==='error'?'回复未完成，已有内容保留':undefined} onRetry={()=>setMessage('重试回调已触发')}>先明确你想帮助谁，再写出他们希望完成的事。保持一个主要目标，让下一步容易开始。</C>;
 if(entry.suffix==='Composer')content=<C value={text} onChange={setText} loading={state==='loading'} disabled={state==='disabled'} error={state==='error'?'发送未完成，输入仍然保留':undefined} onStop={()=>setMessage('停止回调已触发')} onSend={()=>setMessage(`已触发发送：${text}`)} onFiles={files=>setMessage(`已选择 ${files.length} 个本地文件；未上传`)}/>;
 if(entry.suffix==='ConversationList')content=<C items={[{id:'one',title:'整理产品想法'},{id:'two',title:'本周工作计划'}]} value={value} onChange={setValue} onCreate={()=>setMessage('创建回调已触发')}/>;
 if(entry.suffix==='PromptSuggestions')content=<C disabled={state==='disabled'} items={[{id:'one',title:'梳理想法',description:'得到清晰的提纲',prompt:'请帮我整理产品提纲'},{id:'two',title:'安排计划',description:'从下一步开始',prompt:'安排本周计划'}]} onSelect={setMessage}/>;
 return <div className="du-example-stack">{content}<span role="status" className="du-muted">{message}</span></div>;
}
export const componentExamples=Object.fromEntries(['SegmentedControl','Message','Composer','ConversationList','PromptSuggestions','ChatWorkspace'].map(name=>['Dialogue'+name,Example]));
