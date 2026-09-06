// 使用公开子路径，生成可直接粘贴到 React 项目的完整示例。
export function businessExample(suite) {
  const prefix = suite.componentPrefix ?? (suite.prefix === "qw" ? "Quiet" : "Ledger");
  return `import { useState } from "react";
import { ${prefix}DataTable, ${prefix}Drawer, ${prefix}Field } from "ui-design-lab/${suite.id}";
import "ui-design-lab/${suite.id}/tokens.css";
import "ui-design-lab/${suite.id}/components.css";

export default function Projects() {
  const [rows, setRows] = useState([{ id: "p1", name: "品牌研究", status: "进行中" }]);
  const [draft, setDraft] = useState(null);
  return <section data-ui-system="${suite.id}" data-density="comfortable">
    <${prefix}DataTable rows={rows} caption="项目列表"
      columns={[{ key: "name", label: "项目" }, { key: "status", label: "状态" }]}
      onRowActivate={row => setDraft({ ...row })} />
    <${prefix}Drawer open={!!draft} title="编辑项目" onOpenChange={open => { if (!open) setDraft(null); }}>
      {draft && <>
        <${prefix}Field label="项目名称" value={draft.name}
          onChange={event => setDraft({ ...draft, name: event.target.value })} />
        <button type="button" disabled={!draft.name.trim()} onClick={() => {
          setRows(items => items.map(item => item.id === draft.id ? draft : item));
          setDraft(null);
        }}>保存</button>
      </>}
    </${prefix}Drawer>
  </section>;
}`;
}
