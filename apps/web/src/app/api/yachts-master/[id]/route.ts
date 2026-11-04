import sql from '@/app/api/utils/sql';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [row] = await sql`SELECT * FROM yachts_master WHERE id = ${id}`;
    if (!row) return Response.json(null, { status: 404 });
    return Response.json(row);
  } catch (e) {
    console.error(e);
    return Response.json(null, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { adminPassword, ...data } = body;

    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const setClauses: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    const fields: Record<string, unknown> = {
      name: data.name,
      description: data.description,
      why_choose: data.why_choose,
      type: data.type,
      capacity: data.capacity ? parseInt(data.capacity) : undefined,
      duration: data.duration,
      sailing_price: data.sailing_price ? parseInt(data.sailing_price) : undefined,
      sailing_price_2hr: data.sailing_price_2hr ? parseInt(data.sailing_price_2hr) : undefined,
      anchorage_price: data.anchorage_price ? parseInt(data.anchorage_price) : undefined,
      banner_image: data.banner_image,
      promo_label: data.promo_label,
      reel_url: data.reel_url,
      live_video_url: data.live_video_url,
      is_active: data.is_active,
      sort_order: data.sort_order ? parseInt(data.sort_order) : undefined,
    };

    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) {
        setClauses.push(`${key} = $${i++}`);
        values.push(val);
      }
    }

    // JSON fields
    if (data.images !== undefined) {
      setClauses.push(`images = $${i++}::jsonb`);
      values.push(JSON.stringify(data.images));
    }
    if (data.inclusions !== undefined) {
      setClauses.push(`inclusions = $${i++}::jsonb`);
      values.push(JSON.stringify(data.inclusions));
    }
    if (data.exclusions !== undefined) {
      setClauses.push(`exclusions = $${i++}::jsonb`);
      values.push(JSON.stringify(data.exclusions));
    }
    if (data.best_for !== undefined) {
      setClauses.push(`best_for = $${i++}::jsonb`);
      values.push(JSON.stringify(data.best_for));
    }

    if (setClauses.length === 0)
      return Response.json({ error: 'Nothing to update' }, { status: 400 });

    values.push(id);
    const rows = await sql(
      `UPDATE yachts_master SET ${setClauses.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return Response.json(rows[0] ?? null);
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== body.adminPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await sql`DELETE FROM yachts_master WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
