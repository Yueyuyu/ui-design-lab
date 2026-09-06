import {createRequire} from "node:module";
import {readFile,writeFile} from "node:fs/promises";
// 仅生成网页传输衍生文件，原创 PNG 原件保留；不改变艺术内容。
const require=createRequire(import.meta.url);
const sharp=require(process.env.UI_LAB_SHARP || "sharp");
for(const name of ["field-notes","momentum","signals"]){
 await sharp("systems/signal-studio/assets/"+name+".png").resize({width:name==="field-notes"?1000:600,withoutEnlargement:true}).webp({quality:82}).toFile("systems/signal-studio/assets/"+name+".webp");
}
const path="systems/signal-studio/web/ContentBoard.jsx";
await writeFile(path,(await readFile(path,"utf8")).replaceAll('../assets/field-notes.png','../assets/field-notes.webp').replaceAll('../assets/momentum.png','../assets/momentum.webp').replaceAll('../assets/signals.png','../assets/signals.webp'));
