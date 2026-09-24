import {useEffect, useState} from 'react';
import {ArrowLeft, ArrowRight, ArrowsClockwise, BookOpen, Cube, Info} from '@phosphor-icons/react';
import {getSuiteById} from '../registry/suites.js';
import {kits} from './kits.js';
import {LoadBoundary} from './LoadBoundary.jsx';
import './scene-player.css';

export function ScenePlayer({kitId}) {
  const kit = kits.find(item => item.id === kitId);
  const suite = getSuiteById(kit?.preferred);
  const [module, setModule] = useState(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setModule(null); setFailed(false);
    suite?.loadShowcase().then(value => {if (active) setModule(value);}).catch(() => {if (active) setFailed(true);});
    return () => {active = false;};
  }, [suite, attempt]);
  useEffect(() => {
    const previous = document.title;
    document.title = kit ? `${kit.title} · ${suite.localizedName} · UI Design Lab` : '未找到场景 · UI Design Lab';
    return () => {document.title = previous;};
  }, [kit, suite]);
  const Scene = module?.scenes?.[kitId];
  if (!kit || !suite) return <main className="scene-missing"><h1>未找到这个示例</h1><a href="#/systems">返回设计系统</a></main>;
  return <div className="scene-player public-design-context">
    <header className="scene-toolbar">
      <a href={`#/systems/${suite.id}/patterns`} className="scene-back"><ArrowLeft size={18} aria-hidden="true"/>返回应用示例</a>
      <nav aria-label="示例使用路径">
        <a href={`#/systems/${suite.id}/guidelines/extension`}><BookOpen size={18} aria-hidden="true"/>查看设计规则</a>
        <a href={`#/systems/${suite.id}/components`}><Cube size={18} aria-hidden="true"/>查看组成组件</a>
        <a className="scene-adopt" href={`#/usage?suite=${suite.id}&kit=${kit.id}`}>用于我的项目<ArrowRight size={18} aria-hidden="true"/></a>
      </nav>
    </header>
    <section className="scene-intro" aria-labelledby="scene-heading">
      <div className="scene-intro-copy"><span className="scene-kicker">{suite.localizedName} · 应用示例</span><h1 id="scene-heading">{kit.title}</h1><p>{kit.purpose}</p></div>
      <div className="scene-try"><h2>可以这样体验</h2><ol>{kit.trySteps.map(step => <li key={step}>{step}</li>)}</ol></div>
      <p className="scene-demo-note"><Info size={18} aria-hidden="true"/>{kit.demoNote ?? '此页使用示例数据，操作仅影响演示，不连接真实业务服务。'}</p>
    </section>
    <div className="scene-canvas-heading"><span>交互预览</span><button type="button" onClick={() => setRevision(value => value + 1)}><ArrowsClockwise size={17} aria-hidden="true"/>重新开始</button></div>
    <main className="scene-surface" data-ui-system={suite.id} data-density="comfortable">
      {failed ? <div role="alert">场景加载失败。<button type="button" onClick={() => setAttempt(value => value + 1)}>重新加载</button></div> : Scene ? <LoadBoundary key={`${kitId}-${revision}`}><Scene key={revision}/></LoadBoundary> : module ? <p>该场景暂未提供独立体验。<a href={kit.route}>打开文档示例</a></p> : <p role="status">正在加载场景…</p>}
    </main>
    <footer className="scene-boundary"><details><summary>演示范围与实现说明</summary><p>{kit.previewBoundary ?? kit.boundary} “重新开始”重建演示会话，保留原工作区中的数据。</p><a href={kit.route}>查看示例文档与代码 →</a></details><p>示例展示本套的一种用法。你也可以沿用它的设计规则，创建自己的页面与新组件。</p></footer>
  </div>;
}
