import {useState} from 'react';
import {SignalStoryCard,SignalRevisionList} from '../web/index.js';
import image from '../assets/field-notes.webp';
const story={id:'field-notes',title:'Field Notes',description:'关于设计、文化与变化的观察。',status:'Featured',owner:'Avery Reed',image,updatedAt:'2026-09-06'};
function StoryExample({entry}) {
  const [message,setMessage]=useState('');
  const open=value=>setMessage(`打开内容：${value.title}`);
  return <div className="doc-example">{entry.suffix === 'StoryCard' ? <div className="ss-single-story"><SignalStoryCard story={story} onOpen={open}/></div> : <SignalRevisionList stories={[story]} onOpen={open}/>}<p role="status">{message}</p></div>;
}
export const businessExamples={SignalStoryCard:StoryExample,SignalRevisionList:StoryExample};
