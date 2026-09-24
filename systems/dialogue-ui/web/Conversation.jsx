import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Stop, Copy, Check, Plus, ChatCircle, PencilSimpleLine, X, SidebarSimple, Sparkle } from '@phosphor-icons/react';
import { DialogueButton, DialogueIconButton, DialogueField, DialogueBadge, DialogueNotification } from './Controls.jsx';

export function DialogueMessage({role='assistant',children,loading,error,onRetry}) {
  const [copied,setCopied]=useState(false),[copyError,setCopyError]=useState(''),text=useRef(null),timer=useRef(null);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  async function copy(){try{await navigator.clipboard.writeText(text.current?.innerText ?? '');setCopyError('');setCopied(true);clearTimeout(timer.current);timer.current=setTimeout(()=>setCopied(false),1600);}catch{setCopyError('复制未完成，请选择正文手动复制');}}
  return <article className={`du-message du-message--${role}`} aria-label={role==='user'?'你的消息':'助手回复'}><span className="du-message-role">{role==='user'?'你':'助手'}</span><div className="du-message-content" ref={text}>{children}</div>{loading && <p role="status" className="du-thinking"><Sparkle size={16}/>正在组织回复…</p>}{error && <DialogueNotification tone="error" title="回复未完成" description={error} actionLabel={onRetry?'重试':undefined} onAction={onRetry}/>}<div className="du-message-actions">{role==='assistant'&&!loading&&!error&&<DialogueIconButton icon={copied?Check:Copy} label={copied?'已复制':'复制回复'} onClick={copy}/>}<span role="status">{copied?'已复制':copyError}</span></div></article>;
}
export function DialoguePromptSuggestions({items,onSelect,disabled}) {return <div className="du-suggestions" aria-label="开始一个话题">{items.map(item=><button type="button" key={item.id} disabled={disabled} onClick={()=>onSelect?.(item.prompt)}><span>{item.title}</span><small>{item.description}</small></button>)}</div>;}
export function DialogueComposer({value,onChange,onSend,onStop,loading=false,disabled=false,error,placeholder='输入你的问题…',onFiles}) {
  const input=useRef(null),files=useRef(null),composing=useRef(false);
  function submit(event){event.preventDefault();if(!loading&&!disabled&&value.trim())onSend?.();}
  return <form className="du-composer" onSubmit={submit} aria-label="消息输入"><textarea ref={input} aria-label="消息内容" placeholder={placeholder} value={value} disabled={disabled} rows={2} onChange={event=>onChange?.(event.target.value)} onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={()=>{composing.current=false;}} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing&&!composing.current&&event.keyCode!==229){event.preventDefault();if(!loading&&!disabled&&value.trim())onSend?.();}}}/><div className="du-composer-tools"><div>{onFiles && <><input type="file" multiple ref={files} className="du-sr" tabIndex={-1} aria-label="选择附件" disabled={disabled||loading} onChange={event=>{onFiles([...event.target.files]);event.target.value='';}}/><DialogueIconButton icon={Plus} label="添加附件" disabled={disabled||loading} onClick={()=>files.current?.click()}/></>}<span>Shift + Enter 换行</span></div>{loading?<DialogueIconButton icon={Stop} key="stop" label="停止生成" variant="primary" onClick={event=>{event.preventDefault();onStop?.();}}/>:<DialogueIconButton key="send" icon={ArrowUp} label="发送消息" variant="primary" type="submit" disabled={disabled||!value.trim()}/>}</div>{error && <p role="alert" className="du-error">{error}</p>}</form>;
}
export function DialogueConversationList({items,value,onChange,onCreate}) {
  const [query,setQuery]=useState('');const shown=items.filter(item=>item.title.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="du-conversations"><DialogueButton variant="ghost" onClick={onCreate}><PencilSimpleLine size={19}/>新建对话</DialogueButton><DialogueField label="搜索对话" type="search" placeholder="搜索历史记录" value={query} onChange={event=>setQuery(event.target.value)}/><nav aria-label="对话历史">{shown.map(item=><button type="button" key={item.id} aria-current={item.id===value?'page':undefined} onClick={()=>onChange?.(item.id)}><ChatCircle size={17}/><span>{item.title}</span></button>)}</nav>{!shown.length && <p className="du-muted">没有匹配的对话</p>}</div>;
}

const suggestions=[{id:'write',title:'写得更清楚',description:'把一段想法整理成提纲',prompt:'帮我整理一份产品介绍的提纲。'},{id:'research',title:'从问题开始',description:'拆解一个值得研究的主题',prompt:'如何开始一次有用的用户访谈？'},{id:'plan',title:'安排下一步',description:'将目标变成可执行的计划',prompt:'帮我制定本周的项目推进计划。'}];
const seed=[{id:'welcome',title:'一个更清晰的开始',messages:[]}];
function demoReply(prompt,{signal}){return new Promise((resolve,reject)=>{const abort=()=>{clearTimeout(timer);reject(new DOMException('已停止','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve(`这是一条本地演示回复，尚未连接 AI 服务。\n\n你提出了：${prompt}\n\n可以先明确目标，再列出已有信息，最后确定一个可执行的下一步。\n\n接入自己的消息服务后，这里将显示服务返回的内容。`);},800);if(signal.aborted)abort();else signal.addEventListener('abort',abort,{once:true});});}
export function DialogueChatWorkspace({initialConversations,onSend}) {
  const [conversations,setConversations]=useState(()=>initialConversations?.length ? initialConversations.map(c=>({...c,messages:[...c.messages]})):seed.map(c=>({...c,messages:[]})));
  const [activeId,setActiveId]=useState(()=>initialConversations?.[0]?.id ?? 'welcome'),[drafts,setDrafts]=useState({}),[pending,setPending]=useState(null),[failure,setFailure]=useState(null),[notice,setNotice]=useState(''),[navOpen,setNavOpen]=useState(false);
  const request=useRef(null),content=useRef(null),active=conversations.find(c=>c.id===activeId),draft=drafts[activeId] ?? '';
  useEffect(()=>()=>request.current?.abort(),[]);
  useEffect(()=>{content.current?.scrollTo({top:content.current.scrollHeight,behavior:'auto'});},[activeId,pending,active?.messages.length]);
  function stop(){request.current?.abort();request.current=null;setPending(null);setNotice('已停止，输入内容已保留');}
  function select(id){stop();setActiveId(id);setFailure(null);setNotice('');setNavOpen(false);}
  function create(){stop();const id=crypto.randomUUID();setConversations(list=>[{id,title:'新对话',messages:[]},...list]);setActiveId(id);setFailure(null);setNotice('');setNavOpen(false);}
  async function send(retry){
    if(request.current)return;
    const prompt=retry?.prompt ?? draft.trim();if(!prompt)return;
    const id=activeId,controller=new AbortController();request.current=controller;setPending(id);setFailure(null);setNotice('');
    const messages=retry?active.messages:[...active.messages,{id:crypto.randomUUID(),role:'user',content:prompt}];
    setConversations(list=>list.map(c=>c.id===id?{...c,title:c.messages.length?c.title:prompt.slice(0,28),messages}:c));
    try{const reply=await (onSend ?? demoReply)(prompt,{signal:controller.signal,conversationId:id,messages});
      // 切换、停止和卸载都会使当前请求失效，迟到回复不得写入其他会话。
      if(controller.signal.aborted||request.current!==controller)return;
      if(typeof reply!=='string'||!reply.trim())throw new Error('服务没有返回正文，请重试');
      setConversations(list=>list.map(c=>c.id===id?{...c,messages:[...c.messages,{id:crypto.randomUUID(),role:'assistant',content:reply}]}:c));
      setDrafts(values=>values[id]?.trim()===prompt?{...values,[id]:''}:values);
    }catch(cause){if(!controller.signal.aborted)setFailure({id,prompt,message:cause instanceof Error?cause.message:'请稍后重试'});}
    finally{if(request.current===controller){request.current=null;setPending(null);}}
  }
  return <div className="du-workspace"><aside className={`du-workspace-nav ${navOpen?'is-open':''}`}><div className="du-workspace-brand"><ChatCircle size={25} weight="bold"/><strong>Dialogue</strong><DialogueIconButton icon={X} label="关闭对话列表" onClick={()=>setNavOpen(false)}/></div><DialogueConversationList items={conversations} value={activeId} onChange={select} onCreate={create}/><p className="du-local-note">{onSend?'使用项目提供的消息服务':'本地演示 · 刷新后清空'}</p></aside><main className="du-workspace-main"><header className="du-workspace-heading"><DialogueIconButton icon={SidebarSimple} label="切换对话列表" onClick={()=>setNavOpen(!navOpen)}/><strong>Dialogue <span>对话工作空间</span></strong><DialogueBadge>{onSend?'自定义服务':'体验模式'}</DialogueBadge></header><div className="du-transcript" ref={content} aria-label="对话正文">{active?.messages.length ? <div className="du-message-stack">{active.messages.map(message=><DialogueMessage key={message.id} role={message.role}>{message.content}</DialogueMessage>)}{pending===activeId && <DialogueMessage loading/>}{failure?.id===activeId && <DialogueMessage error={failure.message} onRetry={()=>send(failure)}/>}</div>:<div className="du-welcome"><span>把想法说出来</span><h2>今天，从哪里开始？</h2><p>一个问题、一段想法，或者一个新的计划。</p><DialoguePromptSuggestions items={suggestions} onSelect={value=>setDrafts(values=>({...values,[activeId]:value}))}/></div>}</div><div className="du-compose-area"><DialogueComposer value={draft} onChange={value=>setDrafts(values=>({...values,[activeId]:value}))} onSend={()=>send()} onStop={stop} loading={pending===activeId}/><p role="status" className="du-composer-note">{notice || (onSend?'请核对回复中的重要信息。':'此处展示本地示例回复，可接入自己的 AI 服务。')}</p></div></main></div>;
}
