// Best-effort per-instance abuse control; platform-wide limits belong in the Vercel WAF.
const attempts = new Map();
const windowMs = 10 * 60 * 1000;
function limited(req) {
  const ip = req.headers?.['x-real-ip'];
  if (typeof ip !== 'string') return false;
  const now = Date.now();
  for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
  let entry = attempts.get(ip);
  if (!entry) {
    if (attempts.size >= 2048) return true;
    attempts.set(ip, entry = {until:now + windowMs, count:0});
  }
  return ++entry.count > 5;
}
// Vercel Node function. Set BUTTONDOWN_API_KEY in server environment variables.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    return res.status(200).json({ configured: Boolean(process.env.BUTTONDOWN_API_KEY) });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const origin = req.headers?.origin;
  if (origin && origin !== 'https://sky-tablet.vercel.app' && origin !== `https://${process.env.VERCEL_URL}`) {
    return res.status(403).json({error:'Origin not allowed'});
  }
  if (req.body?.website) {
    return res.status(200).json({ ok: true });
  }
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  if (limited(req)) {
    res.setHeader('Retry-After', '600');
    return res.status(429).json({error:'Please try again later'});
  }
  if (!process.env.BUTTONDOWN_API_KEY) {
    return res.status(503).json({ error: 'Subscription unavailable' });
  }
  try {
    const upstream = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Buttondown-Collision-Behavior': 'add'
      },
      body: JSON.stringify({ email_address: email })
    });
    if (!upstream.ok) {
      return res.status(upstream.status === 429 ? 429 : 502).json({
        error: 'Subscription unavailable'
      });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Subscription unavailable' });
  }
}
