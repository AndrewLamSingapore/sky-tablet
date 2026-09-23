// Vercel Node function. Set BUTTONDOWN_API_KEY in server environment variables.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (req.body?.website) {
    return res.status(200).json({ ok: true });
  }
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  if (!process.env.BUTTONDOWN_API_KEY) {
    return res.status(503).json({ error: 'Subscription unavailable' });
  }
  try {
    const upstream = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
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
