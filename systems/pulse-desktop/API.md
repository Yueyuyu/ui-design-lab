# 组件接口

- `PulseQuotaRing({remaining,state,mood,motionEnabled,celebrating,persona,shape,useLogo})`：只表达剩余额度。null 为未知；0 为用尽。非交互图形，父控件提供上下文。
- `PulseTaskRow({task,onOpen,onWatch,disabled})`：task = {id,title,state,watched}；打开、关注分别回调，完成不移除。
- `PulseDesktopDock({mode,remaining,tasks,pinned,dataState,disabled,motionEnabled,dockSide,persona,shape,useLogo,onModeChange,onPinnedChange,onOpenTask,onWatchTask,onRetry,onDragStart})`：受控表现层。
- mode：compact / expanded / docked；dataState：ready / loading / error；task.state：running / completed / attention / unavailable。
- 未固定时，悬停/点击展开都在移出 320ms 后收起；再次点击环、点击外部、窗口失焦和打开任务也会收起。固定才常驻；贴边来源退回细条。宿主不能再叠加第二套外部点击处理，以免覆盖返回状态。
- persona：calm / eager / steady / curious / sleepy / playful / stoic / proud，默认 calm。
- shape：blob / pebble / bean / egg / squircle / tablet / capsule / cylinder / hex / gem / crystal / wedge / shield / dome / arch / cloud / teardrop / leaf，默认 blob。
- useLogo 默认 false；机器人资源不可用或公开构建时，显示 Pulse 原版 OpenAI SVG；true 显式选静态品牌图标。
- motionEnabled=false、系统低动态或页面隐藏时不运行帧循环。只对相邻有效快照的新完成播放 2600ms completion；已有完成不是当前情绪。
- 额度颜色采用 Pulse 75% 已用预警默认值，不影响 Quiet Workspace 的阈值。

Host 负责真实数据、位置、Windows 通知及任务跳转。Gallery/Playground 始终使用固定示例；Windows 宿主显式 `--live` 后使用本机真实快照，没有真实数据时显示未知，不回落为演示值。bridge 不暴露 shell / 任意文件 / 模型请求。

## 真实桌面受控参数

- `quotaState`、`taskState` 分别描述额度与任务读取状态，默认沿用 `dataState`。额度读取失败不阻断正常任务显示。
- `resetLabel`、`sourceLabel` 由宿主提供；默认仍为示例文案。实时入口传入真实重置时间与「本机实时 · 只读」。
- `notice` 用于持久化失败等可恢复消息；`onRefresh` 是用户主动刷新入口。
- `PulseTask.detail` 可提供具体状态文案；`canOpen` 显式允许已知关注任务在暂不可用时跳转。打开按钮与取消关注按钮始终独立。
- `PulseQuotaRing.botState` 默认沿用额度 `state`；桌面组合传入任务读取状态，让额度与任务语义独立。
- `desktop/live-state.js` 只接收 `schemaVersion=1`、`source=companion-live` 且递增序号的完整快照；失联后保留任务身份但将状态标记为暂不可用。
- 初次连接、重连、任务消失不触发完成庆祝；Windows 通知由原有本机模块负责，Gallery 不发送系统通知。

## 独立账户与限高分项

- `applications` 每项隔离身份、额度、任务和图标；最多 8 个注册应用，浮条每页 3 项，翻页不移动原生窗口。详情面板最高 400px，内容区滚动，固定与关闭始终可见。
- `quotaLabel` 与 `quotaWindows: {label,remaining,resetLabel}[]` 保留产品周期和独立额度池；不能将 Cursor 月度池统称周额度，不能平均多个池。侧轨展示首个有效窗口，详情显示全部。
- `authState`：signed-out / authorizing / connected / error / unsupported。`canAuthorize`、`canDisconnect` 与 `authorizationBlocked` 由宿主受控；损坏备用凭据阻止覆盖，仍可停止读取。
- `readMode`：auto / web / off。默认自动读取，不弹登录页；自动读取中隐藏备用登录入口，off 只在显式 `resume-auto` 后恢复。`disconnect-account` 现在表示停止读取并清除备用授权；其持久化由宿主负责，页面不保存凭据。
- 业务快照 `quotaSource` 仅允许 none / desktop-cache / desktop-session / web-login，适配器生成受控来源标签，不透传 Token、Cookie 或文件路径。备用网页账户可能与桌面不同，必须标记；Lab 示例不能访问真实登录。
- `onApplicationAccountAction(applicationId, action)` 的 action 仅 authorize / cancel-authorization / disconnect-account。Gallery 不实现真实账户请求；桌面 bridge 不接受网页给出的 URL。
- `quotaState` 增加 signed-out / authorizing / unsupported / unavailable / rate-limited；非 ready 不展示健康百分比。`taskState=unsupported` 明确未接入，不显示“暂无任务”、星标或完成通知。
- `desktop/account-state.js` 校验各产品能力与状态，只构造显示 DTO，丢弃额外账户字段、Token 和远程图标 URL。品牌 SVG 由构建时固定；暂缺产品标识使用名称缩写，不能回退成 OpenAI。
