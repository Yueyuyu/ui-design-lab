import {useEffect,useState} from 'react';
import {Check,Copy} from '@phosphor-icons/react';
import {copyText} from './copyText.js';

export function PublicCopyButton({text,label='复制',onCopy}) {
 const [status,setStatus]=useState('');
 useEffect(()=>setStatus(''),[text]);
 return <span className="public-copy"><button className="public-button public-button--small" type="button" aria-label={label} onClick={async()=>{
  try {await copyText(text);setStatus('已复制');onCopy?.();}
  catch {setStatus('复制失败，请选中下方内容手动复制。');}
 }}>{status==='已复制'?<Check size={15}/>:<Copy size={15}/>}<span>{status==='已复制'?'已复制':'复制'}</span></button><span className={status==='已复制'?'public-sr-only':'public-copy-error'} role="status">{status}</span></span>;
}
