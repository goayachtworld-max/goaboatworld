import sql from '@/app/api/utils/sql';
import { isAdminAuthorized, unauthorized } from '@/app/api/utils/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yachtId = searchParams.get('yachtId');
  if (!yachtId) return Response.json([], { status: 400 });

  try {
    const rows = await sql`
      SELECT o.* FROM yacht_occasions o
      JOIN yacht_occasion_map m ON o.id = m.occasion_id
      WHERE m.yacht_id = ${yachtId}
      ORDER BY o.sort_order ASC
    `;
    return Response.json(rows);
  } catch (e) {
    return Response.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { yachtId, occasionIds } = body;
    if (!(await isAdminAuthorized(request, body))) return unauthorized();

    const queries = [
      sql`DELETE FROM yacht_occasion_map WHERE yacht_id = ${yachtId}`,
      ...(occasionIds as number[]).map(
        (id) => sql`INSERT INTO yacht_occasion_map (yacht_id, occasion_id) VALUES (${yachtId}, ${id})`
      ),
    ];
    await sql.transaction(queries);

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
