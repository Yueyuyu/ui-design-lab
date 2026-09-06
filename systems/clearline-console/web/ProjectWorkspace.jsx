import { X, Plus, SquaresFour, Folder, Users, Gear } from "@phosphor-icons/react";
import { useState } from "react";
import { ClearShell, ClearTabs } from "./Navigation.jsx";
import { ClearDataTable } from "./DataTable.jsx";
import { ClearButton, ClearField, ClearPanel, ClearSelect } from "./primitives.jsx";
import { ClearDrawer } from "./Overlays.jsx";
const initial = [{
  id: "NW-2026-017",
  name: "Northwind Migration",
  owner: "Maya Patel",
  status: "On track",
  date: "2026-09-04"
}, {
  id: "CP-2026-012",
  name: "Client Portal Redesign",
  owner: "Liam Chen",
  status: "In progress",
  date: "2026-09-05"
}, {
  id: "DP-2026-009",
  name: "Data Platform Upgrade",
  owner: "Elena Rossi",
  status: "In progress",
  date: "2026-09-03"
}, {
  id: "SP-2026-008",
  name: "Security Program Refresh",
  owner: "Jordan Lee",
  status: "On track",
  date: "2026-09-02"
}, {
  id: "MA-2026-006",
  name: "Mobile App Initiative",
  owner: "Priya Nair",
  status: "At risk",
  date: "2026-09-01"
}, {
  id: "HQ-2026-004",
  name: "HQ Workspace Expansion",
  owner: "Marco Silva",
  status: "Planning",
  date: "2026-08-29"
}];
export function ClearProjectWorkspace() {
  const [rows, setRows] = useState(initial),
    [selected, setSelected] = useState(initial[2]),
    [tab, setTab] = useState("details"),
    [nav, setNav] = useState("projects"),
    [newOpen, setNewOpen] = useState(false),
    [name, setName] = useState(""),
    [error, setError] = useState("");
  const options = ["Planning", "In progress", "On track", "At risk"].map(s => ({
    value: s,
    label: s
  }));
  const update = status => {
    setRows(v => v.map(r => r.id === selected.id ? {
      ...r,
      status
    } : r));
    setSelected(v => ({
      ...v,
      status
    }));
  };
  return <ClearShell brand="Clearline Console" navigation={[{
    id: "overview",
    label: "Overview",
    icon: <SquaresFour size={18} />
  }, {
    id: "projects",
    label: "Projects",
    icon: <Folder size={18} />
  }, {
    id: "teams",
    label: "Teams",
    icon: <Users size={18} />
  }, {
    id: "settings",
    label: "Settings",
    icon: <Gear size={18} />
  }]} activeId={nav} onNavigate={setNav} title={nav === "projects" ? "Projects" : nav === "teams" ? "Teams" : nav === "settings" ? "Settings" : "Overview"} actions={<ClearButton onClick={() => setNewOpen(true)}><Plus size={18} aria-hidden="true" /> Add project</ClearButton>}>
 {nav === "projects" ? <div className="cc-project-grid"><ClearDataTable rows={rows} selection={selected ? [selected.id] : []} onSelectionChange={ids => setSelected(rows.find(r => r.id === ids.at(-1)) ?? null)} pageSize={6} columns={[{
        key: "name",
        label: "Project name",
        render: (value, row) => <button type="button" className="cc-project-link" onClick={() => setSelected(row)}>{value}</button>
      }, {
        key: "id",
        label: "Key"
      }, {
        key: "status",
        label: "Status",
        render: value => <span className="cc-project-status" data-status={value}>{value}</span>
      }, {
        key: "owner",
        label: "Owner"
      }, {
        key: "date",
        label: "Updated"
      }]} caption="Project directory" />{selected ? <aside className="cc-project-detail"><header><h3>{selected.name}</h3><ClearButton variant="ghost" aria-label="关闭项目详情" onClick={() => setSelected(null)}><X size={18} aria-hidden="true" /></ClearButton></header><ClearTabs value={tab} onChange={setTab} items={[{
          id: "details",
          label: "Details",
          content: <dl><dt>Project key</dt><dd>{selected.id}</dd><dt>Owner</dt><dd>{selected.owner}</dd><dt>Status</dt><dd><ClearSelect label="项目状态" value={selected.status} onChange={e => update(e.target.value)} options={options} /></dd><dt>Updated</dt><dd>{selected.date}</dd><dt>Priority</dt><dd>Medium</dd><dt>Type</dt><dd>Internal</dd><dt>Department</dt><dd>Platform Engineering</dd><dt>Description</dt><dd>Improve delivery reliability and keep project ownership visible.</dd></dl>
        }, {
          id: "activity",
          label: "Activity",
          content: <p>{selected.owner} · 当前状态 {selected.status}。数据是可编辑的本地示例。</p>
        }]} /></aside> : null}</div> : nav === "teams" ? <ClearPanel title="Project owners">{[...new Set(rows.map(r => r.owner))].map(owner => <p key={owner}>{owner} · {rows.filter(r => r.owner === owner).length} projects</p>)}</ClearPanel> : nav === "settings" ? <ClearPanel title="Directory settings"><p>当前示例使用客户端表格；真实权限与团队资料由业务方接入。</p><ClearButton onClick={() => setNav("projects")}>Back to projects</ClearButton></ClearPanel> : <ClearPanel title={rows.length + " active projects"}><p>{rows.filter(r => r.status === "At risk").length} projects need attention.</p><ClearButton onClick={() => setNav("projects")}>Review projects</ClearButton></ClearPanel>}
 <ClearDrawer open={newOpen} onOpenChange={setNewOpen} title="Add project"><ClearField label="Project name" value={name} error={error} onChange={e => setName(e.target.value)} /><ClearButton onClick={() => {
        if (!name.trim()) {
          setError("请输入项目名称");
          return;
        }
        setRows(v => [...v, {
          id: crypto.randomUUID().slice(0, 8),
          name,
          owner: "You",
          status: "Planning",
          date: "2026-09-05"
        }]);
        setNewOpen(false);
        setNav("projects");
        setName("");
        setError("");
      }}>Create project</ClearButton></ClearDrawer>
 </ClearShell>;
}
