import sql from '@/app/api/utils/sql';

export async function GET(_req: Request, { params }: { params: Promise<{ yachtId: string }> }) {
  const { yachtId } = await params;
  try {
    const rows = await sql`
      SELECT id, name, description, icon, enabled, sort_order
      FROM yacht_amenities
      WHERE yacht_id = ${yachtId}
      ORDER BY sort_order ASC
    `;
    return Response.json(rows);
  } catch (e) {
    console.error(e);
    return Response.json([], { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ yachtId: string }> }) {
  const { yachtId } = await params;
  try {
    const body = await request.json();
    const { adminPassword, name, description, icon, enabled, sort_order } = body;

    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [row] = await sql`
      INSERT INTO yacht_amenities (yacht_id, name, description, icon, enabled, sort_order)
      VALUES (${yachtId}, ${name}, ${description ?? ''}, ${icon ?? '✨'}, ${enabled ?? true}, ${sort_order ?? 99})
      RETURNING *
    `;
    return Response.json(row);
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ yachtId: string }> }) {
  const { yachtId } = await params;
  try {
    const body = await request.json();
    const { adminPassword, id, name, description, icon, enabled, sort_order } = body;

    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const setClauses: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (name !== undefined) {
      setClauses.push(`name = $${idx++}`);
      values.push(name);
    }
    if (description !== undefined) {
      setClauses.push(`description = $${idx++}`);
      values.push(description);
    }
    if (icon !== undefined) {
      setClauses.push(`icon = $${idx++}`);
      values.push(icon);
    }
    if (enabled !== undefined) {
      setClauses.push(`enabled = $${idx++}`);
      values.push(enabled);
    }
    if (sort_order !== undefined) {
      setClauses.push(`sort_order = $${idx++}`);
      values.push(sort_order);
    }

    if (setClauses.length === 0)
      return Response.json({ error: 'Nothing to update' }, { status: 400 });

    values.push(id, yachtId);
    const query = `UPDATE yacht_amenities SET ${setClauses.join(', ')} WHERE id = $${idx++} AND yacht_id = $${idx} RETURNING *`;
    const rows = await sql(query, values);
    return Response.json(rows[0] ?? null);
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ yachtId: string }> }
) {
  const { yachtId } = await params;
  try {
    const body = await request.json();
    const { adminPassword, id } = body;

    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sql`DELETE FROM yacht_amenities WHERE id = ${id} AND yacht_id = ${yachtId}`;
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
