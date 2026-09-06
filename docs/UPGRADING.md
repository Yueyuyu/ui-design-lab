# 版本与升级
组件包版本与套系版本分开：根包承载分发产物；每个 suite.json 定义视觉/组件合同版本。新增套系通过 manifest 进入构建与 exports，不需要应用外壳硬编码。

本次变更均是工作区未发布实现。对图表的兼容变化：
- 通用图表不再内置业务演示值、周期与收益。
- 调用方显式传 data、unit、title、period、source、updatedAt；缺省数据为无数据。
- 示例：LedgerLineChart 的 data=[2,5,4]、labels=["周一","周二","周三"]、unit="次"；不传 value 时摘要取最后一个数值。
- 正负柱图共享零线，零值无伪柱高；非法数值显示错误而非演示替换。

新增业务组件从各套入口导入：Shell、DataTable、Textarea、Checkbox、RadioGroup、Combobox、MultiSelect、DateRange、Tabs、Breadcrumb、Pagination、DropdownMenu、Tooltip、Popover、Drawer、ToastQueue、Progress、Skeleton。名称仍有本套前缀。

升级时先构建 tarball；在测试消费者安装；检查类型/API 与样式；验证表格、保存、取消、浮层焦点、图表、主题往返。新套系保持 experimental，不推断已有用户项目的兼容。生产发布另记录版本、提交和远端 CI。

1.0.0-beta.1：本地原来的 ui-design-lab-1.0.0.tgz 由带预发布版本的包替代。重新运行 npm pack 与生成器；新 Starter 的依赖变为 file:vendor/ui-design-lab-1.0.0-beta.1.tgz。已生成项目不会被自动修改，升级时在项目内安装新包并重新验证。
