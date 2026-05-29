/**
 * Cloudflare Pages Function — Handle B2B inquiry form submissions
 * 
 * Sends form data to the configured email via Resend API.
 * 
 * Setup:
 * 1. Sign up at https://resend.com (free: 100 emails/month)
 * 2. Get your API key from Resend Dashboard
 * 3. Add the secret in Cloudflare Dashboard:
 *    Pages > smart-elderly-care > Functions > Add secret
 *    Name: RESEND_API_KEY
 *    Value: re_xxxxxxxxxxxx
 * 4. Also add: NOTIFICATION_EMAIL = your@email.com
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Only accept POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Allow': 'POST' }
    });
  }

  try {
    // Parse form data (could be JSON or FormData)
    let data;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
    }

    // Validate required fields
    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const company = (data.company || '').trim();
    const product = (data.product || '').trim();
    const phone = (data.phone || '').trim();
    const message = (data.message || '').trim();
    const timestamp = new Date().toISOString();

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!company) {
      return new Response(JSON.stringify({ error: 'Company name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if Resend API key is configured
    const resendApiKey = env.RESEND_API_KEY;
    const notifyEmail = env.NOTIFICATION_EMAIL || 'export@smartelderlycare.com';

    if (resendApiKey) {
      // Send email via Resend
      const emailContent = `
New B2B Inquiry — Smart Elderly Care
======================================

Time:       ${timestamp}
Name:       ${name}
Email:      ${email}
Company:    ${company}
Phone:      ${phone || 'N/A'}
Product:    ${product || 'Not specified'}

Message:
${message || 'No message provided'}
`;

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Smart Elderly Care <inquiry@smartelderlycare.com>',
          to: [notifyEmail],
          subject: `[Inquiry] ${product || 'General'} — ${company} — ${name}`,
          text: emailContent
        })
      });

      if (!resendRes.ok) {
        console.error('Resend API error:', await resendRes.text());
        // Still return success to user (log failure)
      }
    } else {
      // No API key configured — log the submission
      console.log('FORM SUBMISSION (no email configured):', {
        name, email, company, phone, product, message, timestamp
      });
    }

    // Return success to the client
    return new Response(JSON.stringify({
      success: true,
      message: 'Your inquiry has been received. We will respond within 24 hours.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Form submission error:', err);
    return new Response(JSON.stringify({
      error: 'Server error. Please try again or email us directly.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
