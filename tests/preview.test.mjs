import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, isAbsolute } from 'node:path';
import { request } from 'node:http';
import { startPreviewServer } from '../scripts/serve.mjs';

function get(server, path, { method = 'GET', headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port: server.address().port, path, method, headers }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('Node preview serves the standalone product without exposing source or delivering email', async t => {
  const base = await mkdtemp(join(tmpdir(), 'sky-tablet-preview-'));
  const root = join(base, 'public');
  await mkdir(root);
  await mkdir(join(base, 'private'));
  await writeFile(join(base, 'private', 'sentinel.txt'), 'outside-public');
  await writeFile(join(root, 'index.html'), '<h1>Sky Tablet fixture</h1>');
  await writeFile(join(root, 'module.js'), 'export const value = 1;');
  await writeFile(join(root, 'clip.mp4'), '0123456789');
  await mkdir(join(root, 'empty'));
  const server = await startPreviewServer({ root, port: 0 });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    // Remove only this test's generated directory, never a supplied product path.
    const child = relative(tmpdir(), base);
    assert.ok(!isAbsolute(child) && /^sky-tablet-preview-[^\\/]+$/.test(child));
    await rm(base, { recursive: true, force: true });
  });

  await t.test('loopback HTTP pages, module MIME type, HEAD and security headers', async () => {
    assert.equal(server.address().address, '127.0.0.1');
    const page = await get(server, '/?scene=tablet');
    assert.equal(page.status, 200);
    assert.match(page.body, /Sky Tablet fixture/);
    assert.equal(page.headers['x-content-type-options'], 'nosniff');
    assert.equal(page.headers['x-frame-options'], 'SAMEORIGIN');
    assert.match(page.headers['content-security-policy'], /frame-ancestors 'self'/);
    assert.equal((await get(server, '/module.js')).headers['content-type'], 'text/javascript; charset=utf-8');
    const head = await get(server, '/clip.mp4', { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(head.headers['content-length'], '10');
    assert.equal(head.body, '');
  });

  await t.test('video seek ranges return exactly the requested bytes', async () => {
    const part = await get(server, '/clip.mp4', { headers: { Range: 'bytes=2-5' } });
    assert.equal(part.status, 206);
    assert.equal(part.headers['content-range'], 'bytes 2-5/10');
    assert.equal(part.body, '2345');
    assert.equal((await get(server, '/clip.mp4', { headers: { Range: 'bytes=-3' } })).body, '789');
    assert.equal((await get(server, '/clip.mp4', { headers: { Range: 'bytes=8-' } })).body, '89');
    for (const range of ['bytes=20-', 'bytes=3-1', 'bytes=-0', 'bytes=0-1,4-5', 'bytes=bogus']) {
      const res = await get(server, '/clip.mp4', { headers: { Range: range } });
      assert.equal(res.status, 416, range);
      assert.equal(res.headers['content-range'], 'bytes */10');
    }
  });

  await t.test('malformed paths, traversal, directory listing and writes are rejected', async () => {
    assert.equal((await get(server, '/%')).status, 400);
    assert.equal((await get(server, '/%00')).status, 400);
    assert.equal((await get(server, '/%2e%2e%2fprivate/sentinel.txt')).status, 403);
    assert.equal((await get(server, '/%2e%2e%5cprivate/sentinel.txt')).status, 400);
    assert.equal((await get(server, '/empty/')).status, 404);
    assert.equal((await get(server, '/.env')).status, 404);
    assert.equal((await get(server, '/', { method: 'POST' })).status, 405);
    assert.equal((await get(server, '/not-a-page')).status, 404);
  });

  await t.test('symlink and Windows junction targets outside public are rejected', async () => {
    await symlink(join(base, 'private'), join(root, 'escape'), process.platform === 'win32' ? 'junction' : 'dir');
    const res = await get(server, '/escape/sentinel.txt');
    assert.equal(res.status, 403);
    assert.doesNotMatch(res.body, /outside-public/);
  });

  await t.test('both local signup routes report disabled and cannot write to the provider', async () => {
    for (const path of ['/api/subscribe', '/api/evidence-updates']) {
      const state = await get(server, path);
      assert.equal(state.status, 200);
      assert.deepEqual(JSON.parse(state.body), { configured: false });
      assert.equal((await get(server, path, { method: 'POST' })).status, 503);
      assert.equal((await get(server, path, { method: 'DELETE' })).status, 405);
    }
  });
});
