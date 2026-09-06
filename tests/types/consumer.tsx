import { suiteIds, quietWorkspace } from "ui-design-lab";
import { QuietButton, QuietDialog, QuietField, QuietTable } from "ui-design-lab/quiet-workspace";
import { LedgerButton, LedgerDialog, LedgerTable } from "ui-design-lab/midnight-ledger";

const rows = [{ id: "one", amount: 12, customer: "示例客户" }];
export const validConsumer = <>
  <QuietButton onClick={(event) => event.currentTarget.focus()}>保存</QuietButton>
  <LedgerButton loading>正在保存</LedgerButton>
  <QuietField label="名称" value="项目" onChange={(event) => event.target.value} />
  <QuietTable rows={rows} columns={[{ key: "amount", label: "金额", render: (row) => row.amount.toFixed(2) }]} />
  <LedgerTable rows={rows} columns={[{ key: "customer", label: "客户", render: (_value, row) => row.customer }]} />
  <QuietDialog open onOpenChange={() => {}} title="确认"><p>信息</p></QuietDialog>
  <LedgerDialog open={false} onOpenChange={() => {}} title="确认" />
</>;
// @ts-expect-error 不允许传入未定义的视觉状态。
export const invalidState = <QuietButton visualState="unknown">保存</QuietButton>;
// @ts-expect-error 表格 key 必须来自行数据。
export const invalidColumn = <LedgerTable rows={rows} columns={[{ key: "missing", label: "不存在" }]} />;

export const quietId: "quiet-workspace" = suiteIds.quietWorkspace;
export const rootConsumer = <quietWorkspace.QuietButton>根入口</quietWorkspace.QuietButton>;
