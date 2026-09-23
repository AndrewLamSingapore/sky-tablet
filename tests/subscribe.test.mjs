import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/subscribe.js';

function response() {
  return {
    headers: new Map(),
    setHeader(name, value) { this.headers.set(name, value); },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

test('subscription endpoint reports configuration and rejects unsupported methods and invalid email', async () => {
  const originalKey = process.env.BUTTONDOWN_API_KEY;
  delete process.env.BUTTONDOWN_API_KEY;
  let res = response();
  await handler({ method: 'GET', body: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.configured, false);

  process.env.BUTTONDOWN_API_KEY = 'test-key';
  res = response();
  await handler({ method: 'GET', body: {} }, res);
  assert.equal(res.body.configured, true);

  res = response();
  await handler({ method: 'PUT', body: {} }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.get('Allow'), 'GET, POST');

  res = response();
  await handler({ method: 'POST', body: { email: 'invalid' } }, res);
  assert.equal(res.statusCode, 400);
  if (originalKey === undefined) delete process.env.BUTTONDOWN_API_KEY;
  else process.env.BUTTONDOWN_API_KEY = originalKey;
});

test('subscription endpoint does not call Buttondown for honeypot submissions', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('fetch should not run'); };
  const res = response();
  await handler({ method: 'POST', body: { email: 'bot@example.com', website: 'spam' } }, res);
  assert.equal(res.statusCode, 200);
  globalThis.fetch = originalFetch;
});

test('subscription endpoint forwards a valid address and handles provider errors', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.BUTTONDOWN_API_KEY;
  process.env.BUTTONDOWN_API_KEY = 'test-key';
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return { ok: true, status: 201 };
  };
  let res = response();
  await handler({ method: 'POST', body: { email: ' reader@example.com ' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(request.url, 'https://api.buttondown.com/v1/subscribers');
  assert.equal(JSON.parse(request.options.body).email_address, 'reader@example.com');
  assert.equal(request.options.headers.Authorization, 'Token test-key');
  assert.equal(request.options.headers['X-Buttondown-Collision-Behavior'], 'add');

  globalThis.fetch = async () => ({ ok: false, status: 429 });
  res = response();
  await handler({ method: 'POST', body: { email: 'reader@example.com' } }, res);
  assert.equal(res.statusCode, 429);

  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.BUTTONDOWN_API_KEY;
  else process.env.BUTTONDOWN_API_KEY = originalKey;
});
