// Cloudflare Pages Function — contact form handler
// POST /api/submit — sends email via Resend, redirects back to contact page

export async function onRequestPost({ request, env }) {
  const formData = await request.formData();
  const name = formData.get('name') || '';
  const email = formData.get('email') || '';
  const company = formData.get('company') || '';
  const message = formData.get('message') || '';

  // Basic validation
  if (!name || !email || !message) {
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
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company || '—')}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (res.ok) {
      return Response.redirect(`${new URL(request.url).origin}/contact?success=1`, 302);
    } else {
      return Response.redirect(`${new URL(request.url).origin}/contact?success=0`, 302);
    }
  } catch (err) {
    return Response.redirect(`${new URL(request.url).origin}/contact?success=0`, 302);
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
