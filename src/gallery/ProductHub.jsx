import { useState } from "react";
import { suites } from "../registry/suites.js";
import { recordEvent, readEvents } from "./telemetry.js";
import { downloadText } from "./workbench/demo-data.js";
import { betaVersion, integrationSteps } from "./release-info.js";
import { businessExample } from "./workbench/usage-example.js";
const kits = [{
  id: "tasks",
  title: "任务与用量工作台",
  pages: "任务列表、详情与进度、失败重试、结果、用量、设置",
  suitable: "任务型 SaaS 与内部工具",
  preferred: "quiet-workspace"
}, {
  id: "research",
  title: "研究与内容工作台",
  pages: "项目资料、上传、目录搜索、内容详情、版本历史",
  suitable: "研究工具、知识资料与内容运营",
  preferred: "quiet-workspace"
}, {
  id: "reports",
  title: "运营分析与报表",
  pages: "日期筛选、指标、明细、保存视图、CSV 导出、告警偏好",
  suitable: "数据运营、业务分析与报表",
  preferred: "midnight-ledger"
}];
const delivery = "UI Design Lab 初步交付\n包含：React 19 UI 源码、套系组件、Token、API 类型、演示数据、错误恢复、接入说明。\n当前示例采用 MIT 许可，可商用。未来付费仅针对另行标明的原创增值内容和服务。\n不包含：真实认证、任务执行、模型调用、文件存储、支付、邮件、生产 SLA。\n当前未开放购买。模板试价假设199–499元；范围明确的品牌适配试价2000–8000元。\n真正商品需发布独立许可、交付版本、支持与退款条款后再销售。";
export function ProductHub() {
  const [suiteId, setSuite] = useState(suites[0]?.id),
    [path, setPath] = useState("new"),
    [opt, setOpt] = useState(() => {
      try {
        return localStorage.getItem("ui-lab-metrics-opt-in") === "true";
      } catch {
        return false;
      }
    }),
    [message, setMessage] = useState("");
  const suite = suites.find(s => s.id === suiteId);
  const command = integrationSteps(suiteId, path);
  return <main className="product-hub"><p className="home-eyebrow">WORKFLOWS & DELIVERY</p><h1>从选型，到可运行的工作台</h1><p>基础组件、独立视觉语言与连续页面流程。当前示例免费开放，下载源码后可替换业务数据。</p>
 <section><h2>选择一个完整流程</h2><div className="product-kit-grid">{kits.map(kit => <article key={kit.id}><small>React 19 · 本地演示</small><h3>{kit.title}</h3><p>{kit.suitable}</p><p>{kit.pages}</p><a href={"#systems/" + kit.preferred + "/workflows?kit=" + kit.id} onClick={() => recordEvent("kit_view", {
            kitId: kit.id
          })}>预览完整流程 →</a><p>含组件与模拟接口；真实业务服务由你的项目接入。</p></article>)}</div></section>
 <section id="onboarding"><h2>接入你的项目</h2><p>Beta {betaVersion} · Node.js 22+、React 19.2、ESM。以下命令从本版本源码开始；生成的 Starter 自带组件包，整个目录可复制到其他机器。</p><ol><li>从本版本源码生成组件包，或解压收到的 Beta Starter。</li><li>选择一套视觉语言，安装并启动独立项目。</li><li>修改任务名称和表格字段，检查详情与失败重试，再构建交付。</li></ol><div className="workbench-actions"><button type="button" aria-pressed={path === "new"} onClick={() => setPath("new")}>新建项目</button><button type="button" aria-pressed={path === "existing"} onClick={() => setPath("existing")}>已有项目</button><label>使用套系<select value={suiteId} onChange={e => setSuite(e.target.value)}>{suites.filter(s => s.status !== "draft").map(s => <option key={s.id} value={s.id}>{s.displayName}</option>)}</select></label></div><pre>{command}</pre><p>组件放在 data-ui-system="{suite?.id}" 作用域下。字体、图表单位与异步事件按 API 显式传入；主题可从套系内的编辑器导出。</p><button type="button" onClick={() => {
        recordEvent("onboarding_start", {
          suiteId,
          path
        });
        downloadText("integration.md", `# ${suite.displayName} 接入指南\n\n版本：${betaVersion}\n\n\`\`\`sh\n${command}\n\`\`\`\n\n## 页面示例\n\n\`\`\`jsx\n${businessExample(suite)}\n\`\`\`\n\n${delivery}`);
        setMessage("接入说明已生成");
      }}>下载接入说明</button><a href={"#systems/" + suiteId + "/usage"}>查看完整 API 与开发工具指令</a></section>
 <section><h2>免费内容与后续付费方向</h2><div className="product-kit-grid"><article><h3>开源基础 · MIT</h3><p>套系组件、Token、规范与本次工作台示例。允许商用，保留许可声明。</p><strong>免费使用</strong></article><article><h3>原创增值模板</h3><p>未来可出售更完整行业模板、生产接入指南与持续维护。当前示例不会因收费计划撤回 MIT 权利。</p><strong>试价假设 ¥199–499</strong><p>尚未开放购买，尚无成交验证。</p></article><article><h3>品牌与页面适配</h3><p>固定页面范围、两轮修改、源码和交付说明；按工作量单独报价。</p><strong>试价假设 ¥2,000–8,000</strong><p>不包含无限支持或第三方服务费用。</p></article></div><button type="button" onClick={() => downloadText("delivery-scope.txt", delivery)}>下载交付与授权说明</button></section>
 <section><h2>使用反馈与最小统计</h2><p>初步统计只保存在你的浏览器，不发送到服务器。复制指令、Stars 与真实接入分别计算。</p><label><input type="checkbox" checked={opt} onChange={e => {
          try {
            localStorage.setItem("ui-lab-metrics-opt-in", String(e.target.checked));
            setOpt(e.target.checked);
          } catch {
            setMessage("当前浏览器不允许本地存储");
          }
        }} />在本机记录去除业务内容的使用事件</label><div className="workbench-actions"><button type="button" onClick={() => downloadText("local-events.json", JSON.stringify(readEvents(), null, 2), "application/json")}>导出本机事件</button><button type="button" onClick={() => downloadText("feedback.md", "# 试用反馈\n\n项目类型：\n使用套系：\n实际安装成功：是/否\n遇到的步骤与错误：\n缺少的组件：\n能否用在真实项目：\n愿意付费解决的问题：\n是否同意公开匿名案例：默认否\n")}>下载反馈表</button></div></section><p role="status">{message}</p></main>;
}
