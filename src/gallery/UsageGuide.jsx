import {ArrowRight, CaretDown, Info} from '@phosphor-icons/react';
import {lazy, Suspense, useEffect, useState} from 'react';
import {suites, getSuiteById} from '../registry/suites.js';
import {ProjectOnboarding} from './ProjectOnboarding.jsx';
import {UsageResources} from './UsageResources.jsx';
import {AgentHandoff} from './AgentHandoff.jsx';
import {kits} from './kits.js';
import {PublicPageHeading} from './PublicPageHeading.jsx';
import './public-pages.css';
import './usage-guide.css';
const NotionDesignStudy = lazy(() => import('./references/NotionDesignStudy.jsx').then(module => ({default:module.NotionDesignStudy})));

function initialSelection() {
  const query = new URLSearchParams(window.location.hash.split('?')[1]);
  const selected = getSuiteById(query.get('suite'));
  return {suiteId:selected && selected.status !== 'draft' ? selected.id : suites.find(suite => suite.status !== 'draft').id,
    path:query.get('path') === 'existing' ? 'existing' : 'new', kitId:query.get('kit')};
}

export function UsageGuide({reference}) {
  const [selection, setSelection] = useState(initialSelection);
  const [manualOpen, setManualOpen] = useState(false);
  useEffect(() => {window.scrollTo({top:0, behavior:'instant'});}, [reference]);
  useEffect(() => {
    const update = () => setSelection(initialSelection());
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {window.removeEventListener('hashchange', update); window.removeEventListener('popstate', update);};
  }, []);
  if (reference === 'notion') return <Suspense fallback={<p role="status">正在加载设计参考…</p>}><NotionDesignStudy/></Suspense>;
  const suite = getSuiteById(selection.suiteId);
  const kit = kits.find(item => item.id === selection.kitId && item.preferred === suite.id);
  const select = patch => {
    const next = {...selection, ...patch};
    if (patch.suiteId && patch.suiteId !== selection.suiteId) next.kitId = null;
    setSelection(next);
    const query = new URLSearchParams({suite:next.suiteId});
    if (next.path === 'existing') query.set('path', next.path);
    if (next.kitId) query.set('kit', next.kitId);
    window.history.replaceState(null, '', `#/usage?${query}`);
  };
  return <main className="public-page public-container usage-page">
    <PublicPageHeading title="使用方式" description="选好设计语言，交给你的 Agent。"/>
    <AgentHandoff suite={suite} kit={kit} onSuiteChange={suiteId => select({suiteId})}/>
    <section className="usage-manual" data-open={manualOpen}>
      <button className="usage-manual-toggle" type="button" aria-expanded={manualOpen} aria-controls="manual-onboarding" onClick={() => setManualOpen(value => !value)}><CaretDown size={21} aria-hidden="true"/>手动接入</button>
      <div id="manual-onboarding" hidden={!manualOpen}>
        {manualOpen && <>
          <div className="usage-manual-heading"><p>也可以自行下载组件包，按步骤接入项目。</p><a className="public-text-link" href={`#/systems/${suite.id}/patterns`}>查看本套应用示例<ArrowRight size={17} aria-hidden="true"/></a></div>
          <ProjectOnboarding suite={suite} path={selection.path} kit={kit} onPathChange={path => select({path})}/>
          <aside className="usage-boundary"><Info size={18}/><p>当前提供设计规范、UI、示例数据与本地适配器。真实认证、存储和业务服务由你的项目接入。</p></aside>
          <UsageResources suite={suite}/>
        </>}
      </div>
    </section>
  </main>;
}
