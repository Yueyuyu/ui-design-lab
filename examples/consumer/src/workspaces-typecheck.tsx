import { ClearProjectWorkspace, type ClearProject } from 'ui-design-lab/clearline-console';
import { SignalContentBoard, type SignalStory } from 'ui-design-lab/signal-studio';
const projects:ClearProject[]=[];
const stories:SignalStory[]=[];
export const workspaces = <>
  <ClearProjectWorkspace rows={projects} onRowsChange={rows=>rows.map(row=>row.name)} onSaveProject={async(project,{signal})=>{signal.throwIfAborted();return project;}} />
  <SignalContentBoard stories={stories} onStoriesChange={rows=>rows.map(row=>row.title)} onSaveStory={async(story,{signal})=>{signal.throwIfAborted();return story;}} />
  <ClearProjectWorkspace defaultRows={[]} loading error="无法加载" onRetry={()=>{}} readOnly />
  <SignalContentBoard defaultStories={[]} readOnly />
</>;
// @ts-expect-error 保存适配器必须返回完整记录，不能只报告成功。
export const invalidSave = <ClearProjectWorkspace onSaveProject={async()=>true} />;
