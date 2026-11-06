import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    const yachts = await sql`SELECT * FROM yachts_master`;
    const categories = await sql`SELECT * FROM yacht_categories`;
    const types = await sql`SELECT * FROM yacht_types`;
    return Response.json({ yachts, categories, types });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
