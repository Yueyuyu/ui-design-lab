import { FloppyDisk } from "@phosphor-icons/react";
import { useState } from "react";
import {
  QuietButton,
  QuietCard,
  QuietField,
  QuietNotification,
  QuietQuotaPill,
  QuietSelect,
  QuietStatusChip,
  QuietToggle
} from "../web/index.js";
import { GalleryBlock, SectionHeader } from "../../../src/gallery/SectionHeader.jsx";

const workspaceOptions = [
  { value: "research", label: "研究工作区" },
  { value: "monitor", label: "监控工作区" },
  { value: "writing", label: "写作工作区" }
];

export function PlaygroundGallery({ onNotify }) {
  const [workspace, setWorkspace] = useState("research");
  const [notifications, setNotifications] = useState(true);
  const [scenario, setScenario] = useState("default");
  const hasError = scenario === "error";
  const isLoading = scenario === "loading";

  return (
    <>
      <SectionHeader
        eyebrow="INTERACTIVE PLAYGROUND"
        title="交互试验场"
        description="用同一组真实内容检查密度、表单、反馈、语义状态和边界场景。"
        aside={<QuietQuotaPill remainingPercent={37} />}
      />

      <GalleryBlock eyebrow="SCENARIO" title="场景状态" description="切换后同时观察字段、通知和主要操作如何表达相同系统状态。">
        <div className="playground-scenario-switcher" aria-label="场景状态">
          {["default", "loading", "error"].map((value) => (
            <button type="button" key={value} data-active={scenario === value ? "true" : "false"} onClick={() => setScenario(value)}>
              {value === "default" ? "正常" : value === "loading" ? "加载" : "错误"}
            </button>
          ))}
        </div>
      </GalleryBlock>

      <div className="playground-layout">
        <QuietCard eyebrow="STANDARD SCENE A" title="工作区设置">
          <div className="playground-form">
            <QuietField
              label="工作区名称"
              defaultValue="产品研究工作台"
              loading={isLoading}
              error={hasError ? "名称未保存，请检查网络后重试。" : undefined}
              hint="显示在标题栏和任务通知中"
            />
            <QuietSelect
              label="工作区类型"
              value={workspace}
              options={workspaceOptions}
              onChange={(event) => setWorkspace(event.target.value)}
              loading={isLoading}
              error={hasError ? "暂时无法读取工作区类型。" : undefined}
            />
            <QuietToggle
              checked={notifications}
              onChange={setNotifications}
              label="桌面通知"
              description="任务完成或需要处理时通知我"
              loading={isLoading}
              error={hasError ? "通知权限读取失败。" : undefined}
            />
            <div className="playground-actions">
              <QuietButton icon={FloppyDisk} loading={isLoading} error={hasError} onClick={() => onNotify?.("设置已保存")}>保存设置</QuietButton>
              <QuietButton variant="secondary">取消</QuietButton>
            </div>
          </div>
        </QuietCard>

        <QuietCard eyebrow="STANDARD SCENE B" title="状态与反馈">
          <div className="playground-feedback-stack">
            <div className="playground-status-row">
              <QuietStatusChip tone="running" dot>执行中 3</QuietStatusChip>
              <QuietStatusChip tone="attention" dot>需处理 1</QuietStatusChip>
              <QuietStatusChip tone="success" dot>已完成 8</QuietStatusChip>
            </div>
            {hasError ? (
              <QuietNotification tone="error" title="数据同步失败" description="本地修改仍然保留，请检查网络后重试。" />
            ) : (
              <QuietNotification tone="info" title={isLoading ? "正在刷新数据" : "通知规则已启用"} description={isLoading ? "保持当前页面打开，完成后会自动更新。" : "重要任务会通过桌面通知提醒你。"} loading={isLoading} />
            )}
          </div>
        </QuietCard>
      </div>
    </>
  );
}
