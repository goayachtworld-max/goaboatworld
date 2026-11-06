import { createHash, randomBytes } from 'node:crypto';
import sql from '@/app/api/utils/sql';
import { sendEmail } from '@/app/api/utils/send-email.js';

const DEFAULT_ADMIN_EMAIL = 'goaboatworld@gmail.com';
const TOKEN_TTL_MINUTES = 30;

function baseUrl(request: Request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!host) return 'http://localhost:4000';
  const proto =
    request.headers.get('x-forwarded-proto') ||
    (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}

function isLocalHost(request: Request) {
  const host = (request.headers.get('host') || '').split(':')[0];
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.startsWith('192.168.') ||
    host.startsWith('10.')
  );
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_password_resets (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function POST(request: Request) {
  try {
    // Reset link goes to the email configured in Admin → Content, falling back
    // to the site owner's registered address.
    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_email'`;
    const adminEmail = cfg?.value?.trim() || DEFAULT_ADMIN_EMAIL;

    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000).toISOString();

    await ensureTable();
    // Only one live reset link at a time — a new request invalidates earlier ones.
    await sql`UPDATE admin_password_resets SET used_at = NOW() WHERE used_at IS NULL`;
    await sql`
      INSERT INTO admin_password_resets (email, token_hash, expires_at)
      VALUES (${adminEmail}, ${tokenHash}, ${expiresAt})
    `;

    const resetUrl = `${baseUrl(request)}/admin/reset?token=${token}`;

    if (!process.env.RESEND_API_KEY) {
      if (isLocalHost(request)) {
        // Email isn't configured in local development — hand the link back to the UI.
        return Response.json({
          success: true,
          message: 'Email is not configured on this server, so here is your reset link directly:',
          resetUrl,
        });
      }
      console.error('forgot-password: RESEND_API_KEY is not set; cannot email reset link');
      return Response.json(
        { error: 'Email is not configured on this server yet. Please contact the site owner.' },
        { status: 500 }
      );
    }

    await sendEmail({
      to: adminEmail,
      from: 'onboarding@resend.dev',
      subject: 'Reset your Goaboatworld admin password',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#1A3C35;margin:0 0 12px">Goaboatworld Admin</h2>
          <p style="color:#374151;font-size:14px;line-height:1.6">
            A password reset was requested for the Goaboatworld admin panel.
            Use the button below to choose a new password. The link expires in ${TOKEN_TTL_MINUTES} minutes.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#1A3C35;color:#ffffff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:14px;margin:8px 0">
            Reset admin password
          </a>
          <p style="color:#6B7280;font-size:12px;line-height:1.6">
            If you didn't request this, you can ignore this email — your password stays unchanged.
          </p>
          <p style="color:#9CA3AF;font-size:11px;word-break:break-all">${resetUrl}</p>
        </div>
      `,
      text: `Reset your Goaboatworld admin password (expires in ${TOKEN_TTL_MINUTES} minutes): ${resetUrl}\n\nIf you didn't request this, ignore this email.`,
    });

    return Response.json({
      success: true,
      message: `A password reset link has been sent to ${adminEmail}. It expires in ${TOKEN_TTL_MINUTES} minutes.`,
    });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: 'Could not send the reset link. Please try again.' },
      { status: 500 }
    );
  }
}
