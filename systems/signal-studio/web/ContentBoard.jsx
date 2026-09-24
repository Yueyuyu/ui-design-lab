// 通过原生属性设置 inert，兼容 React 18/19 的布尔属性差异。
import { SignalStoryCard, SignalRevisionList } from './ContentComponents.jsx';
import { Plus, Sparkle } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { SignalShell } from './Navigation.jsx';
import { SignalButton, SignalField, SignalSelect, SignalPanel } from './primitives.jsx';
import { SignalTextarea } from './Inputs.jsx';
import { SignalDrawer } from './Overlays.jsx';
import { storyExamples } from './demo-data.js';

export function SignalContentBoard({ stories: controlledStories, defaultStories = storyExamples, onStoriesChange, onSaveStory, loading = false, error: loadError, onRetry, readOnly = false } = {}) {
  const [localStories, setLocalStories] = useState(defaultStories);
  const stories = controlledStories ?? localStories;
  const [view, setView] = useState('board');
  const [nav, setNav] = useState('stories');
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [revisions, setRevisions] = useState([]);
  const request = useRef(null);
  const latestStories = useRef(stories); latestStories.current = stories;
  const editable = !readOnly && (controlledStories === undefined || !!onStoriesChange);
  const blocked = saving || loading || !!loadError || !editable;
  useEffect(() => () => request.current?.abort(), []);
  const close = () => { request.current?.abort(); request.current = null; setSaving(false); setDraft(null); setError(''); };
  const edit = story => { setDraft({ ...story }); setError(''); setMessage(''); };
  const create = () => edit({ id: crypto.randomUUID(), title: '', description: '', status: 'Draft', owner: 'You', image: storyExamples[1].image });
  const save = async () => {
    if (!draft || blocked || request.current) return;
    if (!draft.title.trim()) { setError('请输入内容标题'); return; }
    const controller = new AbortController(); request.current = controller;
    const submitted = { ...draft, title: draft.title.trim() };
    setSaving(true); setError('');
    try {
      const saved = onSaveStory ? await onSaveStory(submitted, { signal: controller.signal }) : { ...submitted, updatedAt: new Date().toLocaleString('zh-CN') };
      // 服务可能忽略取消信号，关闭后的返回值不能更新新打开的草稿。
      if (controller.signal.aborted || request.current !== controller) return;
      if (!saved || saved.id !== submitted.id || ['title', 'description', 'status', 'owner', 'image'].some(key => typeof saved[key] !== 'string')) throw new Error('保存服务没有返回完整内容，请检查接入接口。');
      const current = latestStories.current;
      const next = current.some(story => story.id === saved.id) ? current.map(story => story.id === saved.id ? saved : story) : [...current, saved];
      onStoriesChange?.(next);
      if (controlledStories === undefined) setLocalStories(next);
      setRevisions(items => [{ ...saved, id: saved.id + ':' + crypto.randomUUID(), sourceId: saved.id }, ...items]);
      setDraft(null); setMessage(onSaveStory ? '内容已保存。' : '已更新本次演示；刷新后恢复示例。');
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : '内容保存失败，请重试。');
    } finally {
      if (request.current === controller) { request.current = null; setSaving(false); }
    }
  };
  return <SignalShell brand={<><Sparkle size={24} aria-hidden="true" /> Signal Studio</>} navigation={[
    { id: 'stories', label: 'Stories' }, { id: 'assets', label: 'Assets' }, { id: 'revisions', label: 'Revisions' },
  ]} activeId={nav} onNavigate={setNav} title={nav === 'stories' ? 'Stories in motion' : nav === 'assets' ? 'Asset library' : 'Recent revisions'}
    actions={<SignalButton disabled={blocked} onClick={create}><Plus size={18} aria-hidden="true" /> Create story</SignalButton>}>
    <p className="ss-board-subtitle">Words, ideas, and design—shaped for impact.</p>
    {(loading || loadError) && <SignalPanel title={loading ? '正在加载内容…' : '内容加载失败'}><p role={loadError ? 'alert' : 'status'}>{loadError || '请稍候，当前内容暂不可编辑。'}</p>{loadError && onRetry && <SignalButton onClick={onRetry}>重新加载内容</SignalButton>}</SignalPanel>}
    {message && <p role="status">{message}</p>}
    <div ref={element => { if (element) element.inert = Boolean(loading || !!loadError); }}>
      {nav === 'revisions' ? <><p>仅记录本次会话中成功保存的版本。</p><SignalRevisionList stories={revisions} onOpen={revision => { const original = stories.find(story => story.id === revision.sourceId); if (original) edit(original); }} /></>
        : nav === 'assets' ? <div className="ss-asset-library"><p>当前内容使用的封面。上传与远程素材管理由接入项目提供。</p><div className="ss-content-list">{stories.map(story => <SignalStoryCard key={story.id} story={story} onOpen={edit} disabled={!editable} />)}</div></div>
        : <><div className="ss-view-switch"><SignalButton variant="secondary" aria-pressed={view === 'board'} onClick={() => setView('board')}>Board</SignalButton><SignalButton variant="secondary" aria-pressed={view === 'list'} onClick={() => setView('list')}>List</SignalButton></div>
          {!stories.length ? <SignalPanel title="还没有内容"><p>新建第一篇草稿，组织标题、说明与封面。</p><SignalButton disabled={!editable} onClick={create}>新建内容</SignalButton></SignalPanel>
            : <div className={view === 'board' ? 'ss-content-board' : 'ss-content-list'}>{stories.map((story, index) => <SignalStoryCard key={story.id} story={story} featured={index === 0 && view === 'board'} onOpen={edit} disabled={!editable} />)}</div>}
          <h3 className="ss-revision-heading">Recent revisions</h3><SignalRevisionList stories={revisions} onOpen={revision => { const original = stories.find(story => story.id === revision.sourceId); if (original) edit(original); }} />
        </>}
    </div>
    <SignalDrawer open={!!draft} onOpenChange={open => { if (!open) close(); }} title="Edit story">
      {saving && <p role="status">正在保存内容…</p>}
      {error && <p className="ss-save-error" role="alert">{error} 草稿已保留。</p>}
      {draft && <form className="ss-story-editor" onSubmit={event => { event.preventDefault(); save(); }}>
        <SignalField label="内容标题" disabled={blocked} value={draft.title} error={error && !draft.title.trim() ? error : undefined} onChange={event => setDraft({ ...draft, title: event.target.value })} />
        <SignalTextarea label="内容说明" disabled={blocked} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} />
        <SignalSelect label="内容状态" disabled={blocked} value={draft.status} options={['Draft', 'In review', 'Featured'].map(value => ({ value, label: value }))} onChange={event => setDraft({ ...draft, status: event.target.value })} />
        <div className="ss-editor-actions"><SignalButton type="submit" loading={saving} disabled={loading || !!loadError || !editable}>{error ? '重试保存内容' : '保存内容'}</SignalButton><SignalButton variant="secondary" onClick={close}>取消编辑</SignalButton></div>
      </form>}
    </SignalDrawer>
  </SignalShell>;
}
