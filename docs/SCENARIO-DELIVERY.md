# 场景包交付与接口
本次三个 UI 示例使用 MIT，源码在 src/gallery/workbench/；通过套系 showcase/ui.js 注入真实组件。离线消费者由 scripts/create-starter.mjs 生成。

| 场景 | 连续页面 | 可操作流程 |
|---|---|---|
| 任务与用量 | 列表、详情/进度、失败、结果、用量、设置 | 新建、筛选、排序、跨页选择、批量开始、取消、重试、下载结果、本地偏好保存 |
| 研究与内容 | 项目资料、上传、目录搜索、详情、版本历史 | 模拟上传/取消/重试、目录定位、全文筛选、编辑、取消、保存版本、载入旧版本 |
| 运营分析 | 筛选、概览、明细、下钻、保存视图、导出、告警设置 | 同一日期口径、CSV、模拟失败恢复、本地视图、告警偏好 |

业务数据：
- Task：id、name、owner、date（本地日历 YYYY-MM-DD）、status、progress、usage、result、history。
- Document：id、name、folder、content、versions[]。
- ReportView：version、name、range.start / range.end。
- 上传适配：upload(file, { signal, onProgress }) -> Promise<result>；取消必须尊重 AbortSignal。

替换模拟服务时提供 createTask / listTasks / getTask / cancelTask / retryTask / getResult、documents/upload / list / saveVersion、report/query / export / getExportStatus。服务端必须执行认证、权限、范围校验、持久化和幂等控制；UI 状态通过适配层更新。现有 UI 没有这些生产服务。

交付包含源码、类型、Token、演示数据、失败/空/加载处理、接入说明、验证记录。任务执行、模型调用、文件存储、用户认证、真实计费与邮件不包含在 UI 模板中。需要真实服务时以独立集成范围交付。

验收使用 docs/ACCEPTANCE.md 和 ROADMAP.md。业务服务是否成功必须取业务返回证据，不能用按钮提示或构建成功替代。
