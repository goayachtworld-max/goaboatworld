import sql from '@/app/api/utils/sql';
import { isAdminAuthorized, unauthorized } from '@/app/api/utils/auth';

// Keys that must never be sent to the public site.
const PRIVATE_KEYS = new Set(['admin_password', 'admin_email']);

async function fullConfig(): Promise<Record<string, string>> {
  const rows = await sql`SELECT key, value FROM site_config ORDER BY key`;
  const config: Record<string, string> = {};
  for (const row of rows) config[row.key] = row.value;
  return config;
}

export async function GET() {
  try {
    const all = await fullConfig();
    const publicConfig: Record<string, string> = {};
    for (const [key, value] of Object.entries(all)) {
      if (!PRIVATE_KEYS.has(key)) publicConfig[key] = value;
    }
    return Response.json(publicConfig);
  } catch (e) {
    console.error(e);
    return Response.json({}, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { updates } = body as { updates?: Record<string, string> };

    if (!(await isAdminAuthorized(request, body))) {
      return unauthorized();
    }

    // Never let the stored secrets be overwritten with empty values by accident.
    for (const [key, value] of Object.entries(updates ?? {})) {
      if ((key === 'admin_password' || key === 'admin_email') && !String(value).trim()) continue;
      await sql`
        INSERT INTO site_config (key, value, updated_at)
        VALUES (${key}, ${value}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
      `;
    }

    // Admins get the full config (including admin_email) back.
    return Response.json({ success: true, config: await fullConfig() });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
