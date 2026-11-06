import sql from '@/app/api/utils/sql';

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
    const { adminPassword, yachtId, occasionIds } = await request.json();
    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await sql.begin(async (tx) => {
      await tx`DELETE FROM yacht_occasion_map WHERE yacht_id = ${yachtId}`;
      for (const id of occasionIds) {
        await tx`INSERT INTO yacht_occasion_map (yacht_id, occasion_id) VALUES (${yachtId}, ${id})`;
      }
    });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
