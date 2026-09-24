import {useEffect, useMemo, useRef, useState} from 'react';
import {ArrowRight, Check, Copy} from '@phosphor-icons/react';
import {suites} from '../registry/suites.js';
import {copyText} from './copyText.js';
import {recordEvent} from './telemetry.js';
import {buildAgentInstruction} from './agent-instructions.js';
import {AgentSuitePicker} from './AgentSuitePicker.jsx';

export function AgentHandoff({suite, kit, onSuiteChange}) {
  const [copyStatus, setCopyStatus] = useState('');
  const [showInstruction, setShowInstruction] = useState(false);
  const instructionRef = useRef(null);
  const generation = useRef(0);
  const delivery = useMemo(() => {
    try {
      return {prompt:buildAgentInstruction({suite, kit}), invalid:false};
    } catch {return {prompt:'', invalid:true};}
  }, [suite, kit]);
  useEffect(() => {generation.current += 1; setCopyStatus('');}, [delivery.prompt]);
  useEffect(() => {if (copyStatus === 'error') instructionRef.current?.focus();}, [copyStatus]);
  async function copyInstruction() {
    const currentGeneration = generation.current;
    setCopyStatus('copying');
    try {
      await copyText(delivery.prompt);
      if (currentGeneration !== generation.current) return;
      setCopyStatus('copied');
      recordEvent('instruction_copy', {suiteId:suite.id});
    } catch {
      if (currentGeneration !== generation.current) return;
      setCopyStatus('error');
      setShowInstruction(true);
    }
  }
  const unavailable = delivery.invalid;
  return <section className="agent-handoff" aria-label="选择套系并接入 Agent">
    <AgentSuitePicker suite={suite} suites={suites} onChange={onSuiteChange}/>
    <p className="agent-suite-description">{suite.selection?.summary ?? suite.description}</p>
    {kit && <p className="agent-example-context">参考示例：{kit.title}<a href={`#/scenes/${kit.id}`}>回看示例<ArrowRight size={15} aria-hidden="true"/></a></p>}
    <button className="agent-copy" type="button" onClick={copyInstruction} disabled={!delivery.prompt || unavailable || copyStatus === 'copying'} aria-label="复制接入指令">
      {copyStatus === 'copied' ? <Check size={27} aria-hidden="true"/> : <Copy size={27} aria-hidden="true"/>}
      {copyStatus === 'copied' ? '已复制接入指令' : copyStatus === 'copying' ? '正在复制…' : '复制接入指令'}
    </button>
    {unavailable && <p className="agent-copy-error" role="alert">此套系暂时无法生成接入指令，请选择其他套系，或展开下方“手动接入”。</p>}
    <div className="agent-handoff-help"><p>在你的项目中粘贴指令，再告诉 Agent 你想做什么。</p><button type="button" aria-expanded={showInstruction} aria-controls="agent-instruction" onClick={() => setShowInstruction(value => !value)}>{showInstruction ? '收起指令内容' : '查看指令内容'}<ArrowRight size={20} aria-hidden="true"/></button></div>
    <p className="agent-compatible">适用于 Codex、Claude Code、Cursor 等</p>
    <p className={copyStatus === 'error' ? 'agent-copy-error' : 'public-sr-only'} role="status">{copyStatus === 'copied' ? '已复制，可以粘贴到你的 Agent。' : copyStatus === 'error' ? '复制失败，指令已展开，请选中文字手动复制。' : ''}</p>
    <div id="agent-instruction" className="agent-instruction" hidden={!showInstruction} tabIndex={-1} ref={instructionRef}>
      <h2>将这些内容交给 Agent</h2><p>Agent 会从 GitHub 读取所选套系的规范，完成接入。</p>
      <pre><code>{delivery.prompt || '此套系暂时无法生成接入指令。'}</code></pre>
    </div>
  </section>;
}
