import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {buildAgentInstruction} from '../src/gallery/agent-instructions.js';

const input = {suite:{id:'quiet-workspace',displayName:'Quiet Workspace',localizedName:'静谧工作台',status:'stable'}};

test('每套可接入套系只复制简短目标和真实指南入口，不展开设计文档或 API', async () => {
  for (const entry of await readdir(new URL('../systems/', import.meta.url),{withFileTypes:true})) {
    if (!entry.isDirectory()) continue;
    const id = entry.name;
    const suite = JSON.parse(await readFile(new URL(`../systems/${id}/suite.json`,import.meta.url),'utf8'));
    if (suite.status === 'draft') continue;
    const prompt = buildAgentInstruction({suite});
    assert.ok(prompt.includes(`（${id}）`));
    assert.ok(prompt.length < 350, `${id} 指令应保持简短`);
    assert.equal(prompt.split('\n').length,3);
    const url = new URL(prompt.match(/https:\/\/\S+/)[0]);
    assert.equal(url.hostname,'raw.githubusercontent.com');
    assert.equal(url.pathname,'/Yueyuyu/ui-design-lab/main/skills/consume-suite/SKILL.md');
    assert.ok(!/localhost|127\.0\.0\.1|\/downloads\/|npm |```|SHA-256|interface /.test(prompt));
  }
});

test('简短入口对应的仓库指南提供实际获取、设计扩展和验证步骤', async () => {
  const guide = await readFile(new URL('../skills/consume-suite/SKILL.md',import.meta.url),'utf8');
  for (const text of ['https://github.com/Yueyuyu/ui-design-lab.git','git rev-parse HEAD','npm ci','npm pack','DESIGN.md','standards/extension.md','foundations/tokens.json','API.md','web/index.d.ts','新增组件','check-consumer.mjs']) assert.ok(guide.includes(text),text);
  const pkg = JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
  assert.ok(pkg.files.includes('skills/consume-suite/SKILL.md'));
});

test('无效标识或开发中的套系不能生成接入指令', () => {
  for (const patch of [{id:'../quiet-workspace'},{id:''},{status:'draft'}]) {
    assert.throws(()=>buildAgentInstruction({suite:{...input.suite,...patch}}));
  }
});

test('切换套系后，目标与场景引用一起更新', () => {
  const kit = {preferred:'quiet-workspace',title:'项目与资料'};
  const prompt = buildAgentInstruction({...input,kit});
  assert.ok(prompt.includes('可参考“项目与资料”示例'));
  assert.ok(prompt.length < 350);
  const next = buildAgentInstruction({suite:{...input.suite,id:'midnight-ledger',displayName:'Midnight Ledger',localizedName:'午夜账盘'},kit});
  assert.ok(next.includes('（midnight-ledger）'));
  assert.ok(!/quiet-workspace|静谧工作台|项目与资料/.test(next));
});
