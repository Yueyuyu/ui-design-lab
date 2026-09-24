import { QuietSlider } from 'ui-design-lab/quiet-workspace';
import { LedgerSlider } from 'ui-design-lab/midnight-ledger';
import { ClearSlider } from 'ui-design-lab/clearline-console';
import { SignalSlider } from 'ui-design-lab/signal-studio';

export const sliders = <>
  <QuietSlider label="额度" value={40} unit="%" onChange={value => value.toFixed(0)} />
  <LedgerSlider label="周期" value={14} min={7} max={30} step={7} onChange={value => value.toFixed(0)} />
  <ClearSlider label="数量" value={10} loading hint="正在更新" />
  <SignalSlider label="圆角" value={12} disabled error="无法保存" />
</>;
// @ts-expect-error Slider 回调接收数值，而不是 DOM 事件。
export const invalidCallback = <QuietSlider label="额度" value={40} onChange={(value: {target: HTMLInputElement}) => value.target.value} />;
// @ts-expect-error 受控滑块必须提供数值。
export const invalidValue = <LedgerSlider label="周期" value="14" />;
// @ts-expect-error 标签是必填的可访问名称。
export const missingLabel = <ClearSlider value={10} />;
// @ts-expect-error 单位使用可读文本。
export const invalidUnit = <SignalSlider label="圆角" value={12} unit={12} />;
