// Local static preview only. Newsletter delivery remains a deployed server function.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, relative, isAbsolute, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';

const settings = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const headers = Object.fromEntries(settings.headers[0].headers.map(({key, value}) => [key, value]));
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4'
};
function within(root, path) {
  const child = relative(root, path);
  return child === '' || (!child.startsWith('..') && !isAbsolute(child));
}
function reply(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

export async function startPreviewServer({ root = fileURLToPath(new URL('../public', import.meta.url)), port = 8765 } = {}) {
  const siteRoot = await realpath(root);
  const server = createServer(async (req, res) => {
    for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
    res.setHeader('Cache-Control', 'no-store');
    try {
      let pathname;
      try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
      catch { return reply(res, 400, '{"error":"Invalid URL"}'); }
      if (pathname.includes('\\') || pathname.includes('\0')) return reply(res, 400, '{"error":"Invalid URL"}');
      if (pathname === '/api/evidence-updates' || pathname === '/api/subscribe') {
        if (req.method === 'GET') return reply(res, 200, '{"configured":false}');
        if (req.method === 'POST') return reply(res, 503, '{"error":"Email delivery is disabled in the local static preview"}');
        res.setHeader('Allow', 'GET, POST');
        return reply(res, 405, '{"error":"Method not allowed"}');
      }
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.setHeader('Allow', 'GET, HEAD');
        return reply(res, 405, '{"error":"Method not allowed"}');
      }
      let path = resolve(siteRoot, `.${pathname}`);
      if (!within(siteRoot, path)) return reply(res, 403, '{"error":"Forbidden"}');
      if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
      path = await realpath(path);
      if (!within(siteRoot, path)) return reply(res, 403, '{"error":"Forbidden"}');
      const file = await stat(path);
      if (!file.isFile()) return reply(res, 404, '{"error":"Not found"}');
      res.setHeader('Content-Type', mime[extname(path).toLowerCase()] || 'application/octet-stream');
      res.setHeader('Accept-Ranges', 'bytes');
      let start = 0, end = file.size - 1, code = 200;
      if (req.method === 'GET' && req.headers.range) {
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if (range && (range[1] || range[2])) {
          start = range[1] ? Number(range[1]) : Math.max(0, file.size - Number(range[2]));
          end = range[1] && range[2] ? Math.min(Number(range[2]), end) : end;
        } else start = file.size;
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= file.size || (range && !range[1] && Number(range[2]) === 0)) {
          res.setHeader('Content-Range', `bytes */${file.size}`);
          return reply(res, 416, '{"error":"Invalid byte range"}');
        }
        code = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${file.size}`);
      }
      res.writeHead(code, { 'Content-Length': Math.max(0, end - start + 1) });
      if (req.method === 'HEAD' || file.size === 0) return res.end();
      const stream = createReadStream(path, { start, end });
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch (error) {
      if (res.headersSent) return res.destroy();
      reply(res, ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500, '{"error":"Unable to serve file"}');
    }
  });
  server.listen(port, '127.0.0.1');
  await once(server, 'listening');
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const server = await startPreviewServer();
    console.log(`Sky Tablet static preview: http://127.0.0.1:${server.address().port}`);
    console.log('Newsletter delivery is disabled locally; all learning pages remain available.');
  } catch (error) {
    console.error(`Could not start the Sky Tablet preview: ${error.message}`);
    process.exitCode = 1;
  }
}
