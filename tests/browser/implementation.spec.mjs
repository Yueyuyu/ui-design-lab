import {test,expect} from "@playwright/test";
import {settingsFlow,taskFlow,overlayFlow,themeFlow} from "./implementation-flows.mjs";
for(const id of ["quiet-workspace","midnight-ledger","clearline-console","signal-studio"]){
 for(const flow of [settingsFlow,taskFlow,overlayFlow,themeFlow])test(id+" "+flow.name,async({page})=>{
 const errors=[];page.on("pageerror",error=>errors.push(error.message));
 await flow({p:page,goto:url=>page.goto(url),id});expect(errors).toEqual([]);
 });
}

import {reportFlow,researchFlow,choicesFlow} from "./content-flows.mjs";
for(const [flow,id] of [[reportFlow,"midnight-ledger"],[researchFlow,"quiet-workspace"],... ["quiet-workspace","midnight-ledger","clearline-console","signal-studio"].map(id=>[choicesFlow,id])])test(id+" "+flow.name,async({page})=>flow({p:page,goto:url=>page.goto(url),id}));
