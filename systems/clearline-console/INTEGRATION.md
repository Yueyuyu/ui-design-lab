# 项目工作台接入

组件包只提供 UI。`ClearProjectWorkspace` 可直接使用业务数据，也可由项目复制页面组合并使用 `ClearProjectTable` 与 `ClearProjectDetails`。

```jsx
import { useState } from 'react';
import { ClearProjectWorkspace } from 'ui-design-lab/clearline-console';
import 'ui-design-lab/clearline-console/tokens.css';
import 'ui-design-lab/clearline-console/components.css';

export function ProjectPage({ initialProjects, saveProject }) {
  const [rows, setRows] = useState(initialProjects);
  return <main data-ui-system="clearline-console">
    <ClearProjectWorkspace rows={rows} onRowsChange={setRows}
      onSaveProject={(project, { signal }) => saveProject(project, { signal })} />
  </main>;
}
```

`saveProject` 是你的服务适配器，必须返回含原 ID 的完整 `ClearProject`，失败抛出 Error；不要在适配器中提前更新 UI。请求应传递 AbortSignal。服务仍可能在取消后完成写入，下一次加载须读取服务端真值。

- `rows + onRowsChange`：受控集合；`rows` 没有回调时只读。初次异步加载可传空数组与 `loading`，成功后替换 rows。
- `defaultRows`：仅首次挂载读取；不传任何数据参数时显示套系示例。切换工作区用不同 React key，避免旧请求影响新工作区。
- `loading / error / onRetry`：读取状态；保存状态由工作台管理。保存失败保留草稿和原记录，重试后才回写；关闭或取消会丢弃当前草稿并取消请求。
- 不传保存适配器时仅修改内存，刷新恢复初始值。权限、审计、持久化和服务端分页由业务项目实现。

验证：新建、状态保存、拒绝保存后重试、请求中关闭、空集合、只读、重新加载失败和窄屏侧详。消费项目运行自己的类型检查、构建及这些交互测试。
