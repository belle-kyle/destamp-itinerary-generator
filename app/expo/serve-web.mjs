// SPA static server for `expo export --platform web` output (dist/).
// expo-router web is a single-entry SPA: deep links / hard <a> navigations
// to client routes (e.g. /auth/signUp) must fall back to index.html,
// otherwise a dumb static server (python -m http.server) returns 404.
// Run from app/expo:  node serve-web.mjs  (serves ./dist on :8099)
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'dist');
const PORT = Number(process.env.PORT) || 8099;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
};

async function tryFile(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
  } catch {}
  return null;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';

    // Resolve safely inside ROOT.
    const filePath = normalize(join(ROOT, pathname));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    // 1) existing file (asset)
    let found = await tryFile(filePath);
    // 2) missing extension -> SPA fallback to index.html
    if (!found && !extname(pathname)) {
      found = await tryFile(join(ROOT, 'index.html'));
    }
    if (!found) {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
      return;
    }

    const body = await readFile(found);
    const type = MIME[extname(found)] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' });
    res.end(body);
  } catch (e) {
    res.writeHead(500).end('Server error: ' + e.message);
  }
});

server.listen(PORT, () => {
  console.log(`SPA preview serving ${ROOT} at http://localhost:${PORT}`);
});
