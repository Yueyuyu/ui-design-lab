import { createServer } from "node:http";
import { readFile, realpath } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

// 仅服务独立消费者的已构建目录，便于在同一浏览器完成离线验收。
if (!process.argv[2]) throw Error("需要独立消费者 dist 目录。");
const root = await realpath(process.argv[2]);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp" };
createServer(async (request, response) => {
  try {
    if (request.method !== "GET" && request.method !== "HEAD") { response.writeHead(405).end(); return; }
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const target = resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
    const file = await realpath(target);
    if (!file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : await readFile(file));
  } catch { response.writeHead(404).end("Not found"); }
}).listen(5174, "127.0.0.1", () => console.log("独立消费者预览：http://127.0.0.1:5174"));
