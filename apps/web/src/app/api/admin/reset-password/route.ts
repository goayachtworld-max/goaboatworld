import { createHash } from 'node:crypto';
import sql from '@/app/api/utils/sql';

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

// Lets the reset page check the link before the admin types a new password.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) return Response.json({ valid: false });
    const [row] = await sql`
      SELECT id FROM admin_password_resets
      WHERE token_hash = ${hashToken(token)} AND used_at IS NULL AND expires_at > NOW()
    `;
    return Response.json({ valid: !!row });
  } catch (e) {
    console.error(e);
    return Response.json({ valid: false });
  }
}

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || typeof token !== 'string') {
      return Response.json({ error: 'Invalid reset link.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const [row] = await sql`
      SELECT id FROM admin_password_resets
      WHERE token_hash = ${hashToken(token)} AND used_at IS NULL AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (!row) {
      return Response.json(
        { error: 'This reset link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    await sql`UPDATE admin_password_resets SET used_at = NOW() WHERE id = ${row.id}`;
    await sql`
      INSERT INTO site_config (key, value, updated_at)
      VALUES ('admin_password', ${password}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${password}, updated_at = NOW()
    `;

    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Reset failed. Please try again.' }, { status: 500 });
  }
}
