import sql from '@/app/api/utils/sql';
import { isAdminAuthorized, unauthorized } from '@/app/api/utils/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const yacht = searchParams.get('yacht');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '100');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = 'SELECT * FROM gallery WHERE is_active = true';
  const values: unknown[] = [];
  let idx = 1;

  if (yacht) {
    query += ` AND yacht_name = $${idx++}`;
    values.push(yacht);
  }
  if (category) {
    query += ` AND category = $${idx++}`;
    values.push(category);
  }

  query += ` ORDER BY trip_date DESC NULLS LAST, created_at DESC`;
  query += ` LIMIT $${idx++} OFFSET $${idx}`;
  values.push(limit, offset);

  try {
    const rows = await sql(query, values);
    return Response.json(rows);
  } catch (e) {
    console.error(e);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image_url, caption, trip_date, yacht_name, category } = body;

    if (!(await isAdminAuthorized(req, body))) {
      return unauthorized();
    }

    const [row] = await sql`
      INSERT INTO gallery (image_url, caption, trip_date, yacht_name, category, is_active)
      VALUES (${image_url}, ${caption || ''}, ${trip_date || null}, ${yacht_name || ''}, ${category || ''}, true)
      RETURNING *
    `;
    return Response.json(row);
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to add photo' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!(await isAdminAuthorized(req, body))) {
      return unauthorized();
    }

    await sql`DELETE FROM gallery WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}

// GET distinct filter options
export async function PATCH(_req: Request) {
  try {
    const [yachts, categories] = await sql.transaction([
      sql`SELECT DISTINCT yacht_name FROM gallery WHERE yacht_name != '' AND is_active = true ORDER BY yacht_name`,
      sql`SELECT DISTINCT category FROM gallery WHERE category != '' AND is_active = true ORDER BY category`,
    ]);
    const yachtRows = yachts as unknown as { yacht_name: string }[];
    const categoryRows = categories as unknown as { category: string }[];
    return Response.json({
      yachts: yachtRows.map((r) => r.yacht_name),
      categories: categoryRows.map((r) => r.category),
    });
  } catch (e) {
    console.error(e);
    return Response.json({ yachts: [], categories: [] });
  }
}
