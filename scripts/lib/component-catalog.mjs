import {readFile,readdir} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
import ts from 'typescript';
import {componentDefinitions,componentId} from '../../src/gallery/docs/component-definitions.js';

// 源码会嵌入生成的 JSON；统一换行，避免 Windows 生成后在 GitHub/Linux 检出时失效。
const readSource = async path => (await readFile(path,'utf8')).replace(/\r\n?/g,'\n');

async function publicExports(path, seen = new Set()) {
  if(seen.has(path)) return [];
  seen.add(path);
  const text = await readSource(path);
  const source = ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JSX);
  const result = [];
  for(const node of source.statements) {
    if(ts.isExportDeclaration(node) && node.moduleSpecifier) {
      const target = resolve(dirname(path),node.moduleSpecifier.text);
      const nested = await publicExports(target,seen);
      if(!node.exportClause) result.push(...nested);
      else for(const item of node.exportClause.elements) {
        const name = item.propertyName?.text ?? item.name.text;
        const match = nested.find(entry => entry.name === name);
        if(match) result.push({...match,name:item.name.text});
      }
    } else if(node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
      if(ts.isFunctionDeclaration(node) && node.name) result.push({name:node.name.text,source:path});
      if(ts.isVariableStatement(node)) for(const item of node.declarationList.declarations) result.push({name:item.name.getText(source),source:path});
    }
  }
  return result;
}

function typeIndex(text) {
  const source=ts.createSourceFile('index.d.ts',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  const nodes=new Map();
  for(const node of source.statements) {
    if(node.name) nodes.set(node.name.text,node);
    if(ts.isVariableStatement(node)) for(const declaration of node.declarationList.declarations) nodes.set(declaration.name.getText(source),node);
  }
  return name => {
    const root=nodes.get(name);
    if(!root) throw new Error(`公开导出缺少类型声明：${name}`);
    const included=new Set([name]), result=[root.getText(source)];
    function visit(node) {
      if(ts.isIdentifier(node) && nodes.has(node.text) && !included.has(node.text)) {
        included.add(node.text);
        const dependency=nodes.get(node.text);
        result.push(dependency.getText(source)); visit(dependency);
      }
      ts.forEachChild(node,visit);
    }
    visit(root);
    return result.join('\n\n');
  };
}
const stateAliases={Field:'input',StatusChip:'statusChip',StatusBadge:'statusBadge',Card:'card',QuotaPill:'quotaPill',TaskLight:'taskLight',BarChart:'chart'};
export async function buildComponentCatalog(suiteDir) {
  const suite=JSON.parse(await readFile(resolve(suiteDir,'suite.json'),'utf8'));
  if(!suite.componentPrefix) throw new Error(`${suite.id} 必须明确声明 componentPrefix`);
  const contracts=JSON.parse(await readFile(resolve(suiteDir,'foundations/interaction-states.json'),'utf8'));
  const api=typeIndex(await readSource(resolve(suiteDir,'web/index.d.ts')));
  const exports=await publicExports(resolve(suiteDir,suite.components));
  const unique=[...new Map(exports.map(item => [item.name,item])).values()];
  const result=[];
  for(const item of unique.filter(item => item.name.startsWith(suite.componentPrefix))) {
    const suffix=item.name.slice(suite.componentPrefix.length), definition=componentDefinitions[suffix];
    if(!definition) throw new Error(`${suite.id}: ${item.name} 缺少分类、用途和示例定义`);
    const id=componentId(suffix), camel=suffix[0].toLowerCase()+suffix.slice(1);
    const states=contracts.components[id] ?? contracts.components[camel] ?? contracts.components[stateAliases[suffix]];
    if(!states) throw new Error(`${suite.id}: ${item.name} 缺少七态合同`);
    const directState=['Button','IconButton','Field','Textarea','Select','Slider','Toggle','Checkbox','RadioGroup','Combobox','MultiSelect','DatePicker','DateRange','Metric','QuotaPill','TaskLight','Dialog','Drawer','DataTable'];
    const businessState=['AssetSummary','PerformancePanel','HoldingsPanel','PnlCalendar','ExposurePanel','StrategyPanel','MonthlyReturns','IconPicker','AppLauncher','CommandMenu'];
    const chartState=['BarChart','LineChart','Table'];
    const previewStates=directState.includes(suffix) || businessState.includes(suffix) || chartState.includes(suffix) ? ['default','disabled','loading','error'] : ['default'];
    if(suite.componentPrefix === 'Folio' && suffix === 'Button') previewStates.splice(previewStates.indexOf('error'),1);
    if(['DataTable','Table','BarChart','LineChart','AssetSummary','PerformancePanel','HoldingsPanel','PnlCalendar','ExposurePanel','StrategyPanel','MonthlyReturns'].includes(suffix)) previewStates.push('empty');
    result.push({id,suffix,exportName:item.name,...definition,previewStates,states,api:api(item.name),source:relative(suiteDir,item.source).replaceAll('\\','/'),sourceCode:await readSource(item.source)});
  }
  return result;
}
export async function suiteDirectories(root) {
  const base=resolve(root,'systems');
  return (await readdir(base,{withFileTypes:true})).filter(entry=>entry.isDirectory()).map(entry=>resolve(base,entry.name));
}
