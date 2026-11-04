import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    const rows = await sql`SELECT key, value FROM site_config ORDER BY key`;
    const config: Record<string, string> = {};
    for (const row of rows) config[row.key] = row.value;
    return Response.json(config);
  } catch (e) {
    console.error(e);
    return Response.json({}, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminPassword, updates } = body as {
      adminPassword: string;
      updates: Record<string, string>;
    };

    // Verify admin password
    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update each key
    for (const [key, value] of Object.entries(updates)) {
      await sql`
        INSERT INTO site_config (key, value, updated_at)
        VALUES (${key}, ${value}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
      `;
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
