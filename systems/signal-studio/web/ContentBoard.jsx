import { ArrowRight, Plus, Sparkle } from "@phosphor-icons/react";
import { useState } from "react";
import { SignalShell } from "./Navigation.jsx";
import { SignalButton, SignalField, SignalSelect } from "./primitives.jsx";
import { SignalTextarea } from "./Inputs.jsx";
import { SignalDrawer } from "./Overlays.jsx";
import fieldNotes from "../assets/field-notes.webp";
import momentum from "../assets/momentum.webp";
import signals from "../assets/signals.webp";
const initial = [{
  id: "notes",
  title: "Field Notes",
  description: "Observations from the edges of culture, design, and change.",
  status: "Featured",
  owner: "Avery Reed",
  image: fieldNotes
}, {
  id: "momentum",
  title: "Shaping Momentum",
  description: "On building ideas that move people forward.",
  status: "Draft",
  owner: "Morgan Cole",
  image: momentum
}, {
  id: "signals",
  title: "Signals Ahead",
  description: "Emerging patterns from a world in transition.",
  status: "In review",
  owner: "Jordan Blake",
  image: signals
}];
export function SignalContentBoard() {
  const [stories, setStories] = useState(initial),
    [view, setView] = useState("board"),
    [nav, setNav] = useState("stories"),
    [active, setActive] = useState(null),
    [draft, setDraft] = useState(null),
    [error, setError] = useState(""),
    [revisions, setRevisions] = useState([]);
  const edit = story => {
    setDraft({
      ...story
    });
    setActive(story.id);
    setError("");
  };
  const create = () => edit({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    status: "Draft",
    owner: "You",
    image: momentum
  });
  const save = () => {
    if (!draft.title.trim()) {
      setError("请输入内容标题");
      return;
    }
    setStories(v => v.some(s => s.id === draft.id) ? v.map(s => s.id === draft.id ? draft : s) : [...v, draft]);
    setRevisions(v => [{
      id: crypto.randomUUID(),
      title: draft.title,
      date: new Date().toLocaleString("zh-CN")
    }, ...v]);
    setActive(null);
  };
  return <SignalShell brand={<><Sparkle size={24} aria-hidden="true" /> Signal Studio</>} navigation={[{
    id: "stories",
    label: "Stories"
  }, {
    id: "assets",
    label: "Assets"
  }, {
    id: "revisions",
    label: "Collections"
  }]} activeId={nav} onNavigate={setNav} title={nav === "stories" ? "Stories in motion" : nav === "assets" ? "Asset library" : "Recent revisions"} actions={<SignalButton onClick={create}><Plus size={18} aria-hidden="true" /> Create story</SignalButton>}>
 <p className="ss-board-subtitle">Words, ideas, and design—shaped for impact.</p>
 {nav === "revisions" ? <ul className="ss-revisions">{revisions.length ? revisions.map(r => <li key={r.id}>{r.title}<time>{r.date}</time></li>) : <li>本地编辑后显示版本记录。</li>}</ul> : <><div className="ss-view-switch"><SignalButton variant="secondary" aria-pressed={view === "board"} onClick={() => setView("board")}>Board</SignalButton><SignalButton variant="secondary" aria-pressed={view === "list"} onClick={() => setView("list")}>List</SignalButton></div>
 <div className={view === "board" ? "ss-content-board" : "ss-content-list"}>{stories.map((story, index) => <button type="button" className="ss-story" data-featured={index === 0} key={story.id} onClick={() => edit(story)}>{index === 0 && view === "board" ? <img src={story.image} alt={story.title + " 原创内容封面"} /> : <><span className="ss-story-copy"><small>{story.status.toUpperCase()}</small><strong>{story.title}</strong><span>{story.description}</span></span><img src={story.image} alt={story.title + " 原创内容封面"} /></>}{index === 0 && view === "board" ? <span className="ss-feature-action"><span>Observations from the edges of culture, design, and change.</span><span><ArrowRight size={18} aria-hidden="true" /> Continue story</span></span> : null}</button>)}</div>
 <h3 className="ss-revision-heading">Recent revisions</h3><ul className="ss-revisions">{stories.map(s => <li key={s.id}><img src={s.image} alt="" /><button type="button" onClick={() => edit(s)}>{s.title}</button><span>{s.description}</span><span>{s.owner}</span><time>Updated Sep 5, 2026</time></li>)}</ul></>}
 <SignalDrawer open={!!active} onOpenChange={open => {
      if (!open) setActive(null);
    }} title="Edit story">{draft ? <><SignalField label="内容标题" value={draft.title} error={error} onChange={e => setDraft({
          ...draft,
          title: e.target.value
        })} /><SignalTextarea label="内容说明" value={draft.description} onChange={e => setDraft({
          ...draft,
          description: e.target.value
        })} /><SignalSelect label="内容状态" value={draft.status} onChange={e => setDraft({
          ...draft,
          status: e.target.value
        })} options={["Draft", "In review", "Featured"].map(v => ({
          value: v,
          label: v
        }))} /><SignalButton onClick={save}>保存内容</SignalButton><SignalButton variant="secondary" onClick={() => setActive(null)}>取消编辑</SignalButton></> : null}</SignalDrawer>
 </SignalShell>;
}
