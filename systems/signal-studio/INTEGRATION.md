# 内容工作台接入

`SignalContentBoard` 接受真实内容集合与保存适配器。需要自定义页面时组合 `SignalStoryCard` 和 `SignalRevisionList`，不用复制 Gallery。

```jsx
import { useState } from 'react';
import { SignalContentBoard } from 'ui-design-lab/signal-studio';
import 'ui-design-lab/signal-studio/tokens.css';
import 'ui-design-lab/signal-studio/components.css';

export function ContentPage({ initialStories, saveStory }) {
  const [stories, setStories] = useState(initialStories);
  return <main data-ui-system="signal-studio">
    <SignalContentBoard stories={stories} onStoriesChange={setStories}
      onSaveStory={(story, { signal }) => saveStory(story, { signal })} />
  </main>;
}
```

`saveStory` 返回含原 ID 的完整 `SignalStory`，失败抛出 Error；只有实际成功后才返回。服务若记录更新时间，应返回 updatedAt；UI 不虚构服务端时间。

- `stories + onStoriesChange` 为受控集合；缺少回调时只读。`defaultStories` 仅首次挂载读取，不传时显示套系示例；空数组显示新建入口。
- `loading / error / onRetry` 处理读取状态。保存时禁止重复提交；失败保留标题、说明和状态；重试成功才关闭编辑器和更新列表。
- 取消、关闭或卸载会发出 AbortSignal，并忽略迟到结果。服务可能已经写入，后续需刷新服务端数据；切换工作区用 React key。
- 修订列表仅记录本次会话成功保存的快照；它不是云端版本库。不传保存函数时仅更新内存。
- 素材页展示当前内容封面，不含上传、版权审查和远程素材服务。正式发布、权限和版本恢复由业务项目提供。

验证：新建、编辑、失败重试、重复提交、请求中关闭、只读、空集合和手机抽屉。消费项目运行自己的类型检查、构建及这些交互测试。
