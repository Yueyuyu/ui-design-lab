import { createReadStream, existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

// 未明确授权的几何数据只在本机预览提供，不经 public/ 或生产打包器发布。
export function pulseLocalAssets() {
  const root = resolve('.local-cache/pulse-bot');
  const available = ['grok-bot-engine.js', 'original-data.js', 'catalog.js', 'template.js']
    .every(file => existsSync(resolve(root, file)));
  return { name: 'pulse-local-only',
    config: () => ({define: {'import.meta.env.PULSE_LOCAL_ASSETS_AVAILABLE': JSON.stringify(available)}}),
    configureServer(server) {
    server.middlewares.use('/__pulse-local__', (request, response) => {
      const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(request.socket.remoteAddress);
      const pathname = (request.url || '').split('?')[0];
      const target = resolve(root, '.' + pathname);
      if (!local || !target.startsWith(root + sep) || !/^[\w/.-]+\.js$/.test(pathname) || !existsSync(target)) {
        response.writeHead(404); response.end(); return;
      }
      response.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      response.setHeader('Cache-Control', 'no-store');
      createReadStream(target).pipe(response);
    });
  } };
}
