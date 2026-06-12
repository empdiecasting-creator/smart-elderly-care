// Cloudflare Pages Function — contact form handler
// POST /api/submit — sends email via Resend, redirects back to contact page

// Simple in-memory rate limiter (resets on deploy, good enough for B2B)
const rateMap = new Map();
const RATE_LIMIT = 3;       // max submissions
const RATE_WINDOW = 60_000; // per minute

export async function onRequestPost({ request, env }) {
  const formData = await request.formData();

  // ── 1. Honeypot: bots fill hidden fields, humans don't ──
  if (formData.get('_honey') || formData.get('website')) {
    // Fake success so bots don't know they were caught
    return Response.redirect(`${new URL(request.url).origin}/contact?success=1`, 302);
  }

  // ── 2. Time gate: reject if form submitted too fast ──
  const timestamp = parseInt(formData.get('_ts') || '0');
  if (Date.now() - timestamp < 3000) {
    return Response.redirect(`${new URL(request.url).origin}/contact?success=1`, 302);
  }

  const name = formData.get('name') || '';
  const email = formData.get('email') || '';
  const company = formData.get('company') || '';
  const message = formData.get('message') || '';

  // Basic validation
  if (!name || !email || !message) {
    return Response.redirect(`${new URL(request.url).origin}/contact?success=0`, 302);
  }

  // ── 3. Rate limit by IP ──
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const record = rateMap.get(ip) || { count: 0, reset: now + RATE_WINDOW };
  if (now > record.reset) { record.count = 0; record.reset = now + RATE_WINDOW; }
  record.count++;
  rateMap.set(ip, record);
  if (record.count > RATE_LIMIT) {
    return Response.redirect(`${new URL(request.url).origin}/contact?success=0`, 302);
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EmpCaring <noreply@empcaring.com>',
        to: [env.CONTACT_EMAIL || 'wayhumdragon@gmail.com'],
        subject: `New inquiry from ${name} — ${company || 'No company'}`,
        reply_to: email,
        html: `
          <h2>New Contact Form Inquiry</h2>
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          <p><strong>Company:</strong> ${esc(company || '—')}</p>
          <p><strong>Message:</strong></p>
          <p>${esc(message).replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    return Response.redirect(
      `${new URL(request.url).origin}/contact?success=${res.ok ? 1 : 0}`, 302
    );
  } catch (err) {
    return Response.redirect(`${new URL(request.url).origin}/contact?success=0`, 302);
  }
}

function esc(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
