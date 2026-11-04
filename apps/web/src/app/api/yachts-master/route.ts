import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    const rows = await sql`
      SELECT * FROM yachts_master
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, created_at ASC
    `;
    return Response.json(rows);
  } catch (e) {
    console.error(e);
    return Response.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminPassword, ...data } = body;

    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id =
      data.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') +
      '-' +
      Date.now();

    const [row] = await sql`
      INSERT INTO yachts_master (
        id, name, description, why_choose, type, capacity, duration,
        sailing_price, sailing_price_2hr, anchorage_price,
        banner_image, images, inclusions, exclusions, best_for,
        promo_label, reel_url, live_video_url, is_active, sort_order
      ) VALUES (
        ${id},
        ${data.name},
        ${data.description ?? ''},
        ${data.why_choose ?? ''},
        ${data.type ?? ''},
        ${parseInt(data.capacity) || 0},
        ${data.duration ?? '1–4 Hours'},
        ${parseInt(data.sailing_price) || 0},
        ${parseInt(data.sailing_price_2hr) || 0},
        ${parseInt(data.anchorage_price) || 0},
        ${data.banner_image ?? ''},
        ${JSON.stringify(data.images ?? [])},
        ${JSON.stringify(data.inclusions ?? [])},
        ${JSON.stringify(data.exclusions ?? [])},
        ${JSON.stringify(data.best_for ?? [])},
        ${data.promo_label ?? ''},
        ${data.reel_url ?? ''},
        ${data.live_video_url ?? ''},
        TRUE,
        ${parseInt(data.sort_order) || 99}
      ) RETURNING *
    `;
    return Response.json(row);
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
