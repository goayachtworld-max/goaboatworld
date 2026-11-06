import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM yacht_occasions ORDER BY sort_order ASC`;
    return Response.json(rows);
  } catch (e) {
    return Response.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { adminPassword, name, sort_order } = await request.json();
    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const [row] = await sql`INSERT INTO yacht_occasions (name, sort_order) VALUES (${name}, ${sort_order}) RETURNING *`;
    return Response.json(row);
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { adminPassword, id, name, is_active, sort_order } = await request.json();
    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const [row] = await sql`UPDATE yacht_occasions SET name = ${name}, is_active = ${is_active}, sort_order = ${sort_order} WHERE id = ${id} RETURNING *`;
    return Response.json(row);
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { adminPassword } = await request.json();
    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await sql`DELETE FROM yacht_occasions WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
