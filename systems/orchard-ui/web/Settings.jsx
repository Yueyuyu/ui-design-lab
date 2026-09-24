import { useEffect, useId, useRef, useState } from 'react';
import { Gear, Bell, ShieldCheck, UserCircle, MagnifyingGlass, CaretRight, SlidersHorizontal } from '@phosphor-icons/react';
import { OrchardButton, OrchardField, OrchardSelect, OrchardToggle, OrchardSlider, OrchardSegmentedControl, OrchardBadge, OrchardNotification } from './Controls.jsx';
import { OrchardDialog } from './Overlays.jsx';

export function OrchardNavigationList({label='设置分类',items,value,onChange}) {return <nav className="ou-navigation" aria-label={label}>{items.map(({id,label,icon:Icon,description})=><button type="button" key={id} aria-current={value===id?'page':undefined} onClick={()=>onChange?.(id)}>{Icon && <Icon size={20} aria-hidden="true"/>}<span>{label}{description && <small>{description}</small>}</span><CaretRight size={14} aria-hidden="true"/></button>)}</nav>;}
export function OrchardSettingRow({title,description,icon:Icon,children}) {const id=useId();return <div className="ou-setting-row" role="group" aria-labelledby={id}>{Icon && <span className="ou-setting-icon"><Icon size={21} aria-hidden="true"/></span>}<div className="ou-setting-label"><strong id={id}>{title}</strong>{description && <p>{description}</p>}</div><div className="ou-setting-control">{children}</div></div>;}
export function OrchardSettingsGroup({title,description,children}) {const id=useId();return <section className="ou-settings-group" aria-labelledby={id}><h3 id={id}>{title}</h3><div>{children}</div>{description && <p>{description}</p>}</section>;}

const defaults={name:'我的工作空间',density:'comfortable',notifications:true,previews:false,scale:100,language:'zh-CN'};
const sections=[{id:'general',label:'通用',icon:Gear},{id:'notifications',label:'通知',icon:Bell},{id:'privacy',label:'隐私与安全',icon:ShieldCheck}];
export function OrchardSettingsWorkspace({initialValues,onSave}) {
  const [saved,setSaved]=useState(()=>({...defaults,...initialValues})),[draft,setDraft]=useState(()=>({...defaults,...initialValues}));
  const [section,setSection]=useState('general'),[query,setQuery]=useState(''),[saving,setSaving]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[summary,setSummary]=useState(false);
  const request=useRef(null),dirty=JSON.stringify(saved)!==JSON.stringify(draft);
  useEffect(()=>()=>request.current?.abort(),[]);
  function update(key,value){setDraft(values=>({...values,[key]:value}));setNotice('');setError('');}
  function cancel(){request.current?.abort();request.current=null;setSaving(false);setDraft({...saved});setError('');setNotice('已恢复上次保存的设置');}
  async function save(event){
    event.preventDefault();if(saving)return;
    if(!draft.name.trim()){setError('请填写工作空间名称');return;}
    const controller=new AbortController();request.current=controller;setSaving(true);setError('');setNotice('');
    const submitted={...draft,name:draft.name.trim()};
    try {const result=onSave ? await onSave(submitted,{signal:controller.signal}) : submitted;
      // 取消或卸载后拒绝迟到结果，只有成功响应才能替换已保存值。
      if(controller.signal.aborted || request.current!==controller)return;
      const next={...submitted,...result};setSaved(next);setDraft(next);setNotice(onSave?'设置已保存':'已保存到本次演示；刷新后恢复默认');
    } catch(cause){if(!controller.signal.aborted)setError(cause instanceof Error?cause.message:'保存未完成，请重试');}
    finally{if(request.current===controller){setSaving(false);request.current=null;}}
  }
  const visible=sections.filter(item=>item.label.includes(query.trim())),found=visible.some(item=>item.id===section),selected=found?section:visible[0]?.id;
  return <div className="ou-workspace" data-density={draft.density}>
    <aside className="ou-workspace-nav"><div className="ou-workspace-brand"><SlidersHorizontal size={26}/><strong>偏好设置</strong></div><div className="ou-profile"><UserCircle size={40} weight="duotone"/><div><strong>个人工作空间</strong><small>让工具适应你的习惯</small></div></div><OrchardField label="搜索设置" placeholder="搜索分类" type="search" value={query} onChange={event=>setQuery(event.target.value)}/><OrchardNavigationList items={visible} value={selected} onChange={setSection}/><p className="ou-local-note">设置只影响此演示。</p></aside>
    <main className="ou-workspace-main"><header className="ou-workspace-heading"><div><span>WORKSPACE PREFERENCES</span><h2>{sections.find(item=>item.id===selected)?.label ?? '搜索设置'}</h2><p>每一处调整，都是更顺手的一点。</p></div><OrchardBadge>{dirty?'有未保存更改':'已是最新设置'}</OrchardBadge></header>
      {!selected?<div className="ou-empty"><MagnifyingGlass size={28}/><h3>没有匹配的设置分类</h3><OrchardButton variant="secondary" onClick={()=>setQuery('')}>清除搜索</OrchardButton></div>:<form onSubmit={save}>
      <fieldset className="ou-settings-fields" disabled={saving}>
        {selected==='general' && <><OrchardSettingsGroup title="工作空间" description="这些信息仅用于当前工作空间的显示。"><OrchardSettingRow title="名称" description="保存为工作空间的显示名称"><OrchardField label="工作空间名称" value={draft.name} onChange={event=>update('name',event.target.value)} maxLength={60}/></OrchardSettingRow><OrchardSettingRow title="首选语言" description="保存内容偏好，不切换演示界面语言"><OrchardSelect label="首选语言" value={draft.language} onChange={event=>update('language',event.target.value)} options={[{value:'zh-CN',label:'简体中文'},{value:'en',label:'English'}]}/></OrchardSettingRow></OrchardSettingsGroup>
        <OrchardSettingsGroup title="显示与布局" description="密度影响行距与控件间距，始终保留清晰的文字。"><OrchardSettingRow title="内容密度" icon={SlidersHorizontal}><OrchardSegmentedControl label="内容密度" value={draft.density} onChange={value=>update('density',value)} options={[{value:'comfortable',label:'舒适'},{value:'compact',label:'紧凑'}]}/></OrchardSettingRow><OrchardSettingRow title="内容缩放" description="调整下方阅读示例的文字尺寸"><OrchardSlider label="文字比例" min={90} max={130} step={10} value={draft.scale} unit="%" onChange={value=>update('scale',value)}/></OrchardSettingRow><div className="ou-reading-sample" style={{fontSize:`${draft.scale}%`}}>清晰的层级，让你把注意力留给内容。</div></OrchardSettingsGroup></>}
        {selected==='notifications' && <OrchardSettingsGroup title="通知偏好" description="这里只保存工作空间偏好，不申请系统通知权限。"><OrchardSettingRow title="任务通知" description="任务完成后在应用内提醒" icon={Bell}><OrchardToggle label="启用任务通知" checked={draft.notifications} onChange={value=>update('notifications',value)}/></OrchardSettingRow></OrchardSettingsGroup>}
        {selected==='privacy' && <OrchardSettingsGroup title="内容保护" description="此选项只控制下方演示预览，不代表真实权限配置。"><OrchardSettingRow title="通知预览" description="在通知中显示任务正文" icon={ShieldCheck}><OrchardToggle label="显示通知预览" checked={draft.previews} onChange={value=>update('previews',value)}/></OrchardSettingRow><div className="ou-reading-sample">{draft.previews?'研究资料已整理完成，可前往资料库查看。':'你有一条新通知。'}</div></OrchardSettingsGroup>}
      </fieldset>
      {error && <OrchardNotification title="设置未保存" description={error} tone="error"/>}<p role="status" className="ou-save-status">{notice}</p>
      <footer className="ou-save-bar"><OrchardButton variant="ghost" onClick={()=>setSummary(true)}>查看摘要</OrchardButton><span/><OrchardButton variant="secondary" onClick={cancel} disabled={!dirty&&!saving}>取消</OrchardButton><OrchardButton type="submit" loading={saving} disabled={!dirty}>保存设置</OrchardButton></footer></form>}
      <OrchardDialog open={summary} onOpenChange={setSummary} title="当前设置摘要" footer={<OrchardButton onClick={()=>setSummary(false)}>完成</OrchardButton>}><dl className="ou-summary"><dt>工作空间</dt><dd>{draft.name}</dd><dt>内容密度</dt><dd>{draft.density==='compact'?'紧凑':'舒适'}</dd><dt>任务通知</dt><dd>{draft.notifications?'开启':'关闭'}</dd><dt>通知预览</dt><dd>{draft.previews?'显示正文':'隐藏正文'}</dd></dl><p>摘要包含尚未保存的更改。</p></OrchardDialog>
    </main>
  </div>;
}
