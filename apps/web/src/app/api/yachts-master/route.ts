import sql from '@/app/api/utils/sql';
import { z } from 'zod';

const FilterSchema = z.object({
  category: z.string().optional(),
  guests: z.coerce.number().optional(),
  price_min: z.coerce.number().optional(),
  price_max: z.coerce.number().optional(),
  occasion: z.string().optional(),
  type: z.string().optional(),
  amenities: z.string().optional(),
  sort: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = FilterSchema.parse(Object.fromEntries(searchParams));

    let whereClauses = ['y.is_active = TRUE'];

    if (query.category) {
      const categories = query.category.split(',').map(c => parseInt(c) || 0).join(',');
      whereClauses.push(`y.category_id IN (${categories})`);
    }

    if (query.guests) {
      whereClauses.push(`y.capacity >= ${query.guests}`);
    }

    if (query.price_min !== undefined) {
      whereClauses.push(`y.sailing_price >= ${query.price_min}`);
    }

    if (query.price_max !== undefined) {
      whereClauses.push(`y.sailing_price <= ${query.price_max}`);
    }

    if (query.type) {
      const types = query.type.split(',').map(t => parseInt(t) || 0).join(',');
      whereClauses.push(`y.type_id IN (${types})`);
    }

    if (query.occasion) {
      const occasions = query.occasion.split(',').map(o => parseInt(o) || 0).join(',');
      whereClauses.push(`y.id IN (
        SELECT yacht_id FROM yacht_occasion_map
        WHERE occasion_id IN (${occasions})
      )`);
    }

    if (query.amenities) {
      const amenities = query.amenities.split(',').map(a => `'${a.replace(/'/g, "''")}'`).join(',');
      whereClauses.push(`id IN (
        SELECT yacht_id FROM yacht_amenities
        WHERE name = ANY(ARRAY[${amenities}]) AND enabled = TRUE
      )`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    let orderSql = 'ORDER BY y.sort_order ASC, y.created_at ASC';
    switch (query.sort) {
      case 'popular': orderSql = 'ORDER BY y.is_featured DESC, y.sort_order ASC'; break;
      case 'price_asc': orderSql = 'ORDER BY y.sailing_price ASC'; break;
      case 'price_desc': orderSql = 'ORDER BY y.sailing_price DESC'; break;
      case 'guests_asc': orderSql = 'ORDER BY y.capacity ASC'; break;
      case 'guests_desc': orderSql = 'ORDER BY y.capacity DESC'; break;
      case 'newest': orderSql = 'ORDER BY y.created_at DESC'; break;
    }

    const queryStr = `
      SELECT y.*, c.name as category_name, t.name as type_name
      FROM yachts_master y
      LEFT JOIN yacht_categories c ON y.category_id = c.id
      LEFT JOIN yacht_types t ON y.type_id = t.id
      ${whereSql}
      ${orderSql}
    `;
    const rows = await sql(queryStr);

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
        promo_label, reel_url, live_video_url, is_active, sort_order,
        category_id, type_id, is_featured
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
        ${parseInt(data.sort_order) || 99},
        ${data.category_id || null},
        ${data.type_id || null},
        ${data.is_featured ?? false}
      ) RETURNING *
    `;
    return Response.json(row);
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
