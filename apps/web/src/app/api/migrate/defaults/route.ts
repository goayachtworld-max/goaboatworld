import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    await sql`UPDATE yachts_master SET category_id = (SELECT id FROM yacht_categories WHERE name = 'Luxury Yachts' LIMIT 1) WHERE id IN ('majesty-66', 'azimut-55')`;
    await sql`UPDATE yachts_master SET category_id = (SELECT id FROM yacht_categories WHERE name = 'Premium Yachts' LIMIT 1) WHERE id IN ('fairline-targa', 'sunseeker-predator')`;
    await sql`UPDATE yachts_master SET category_id = (SELECT id FROM yacht_categories WHERE name = 'Budget Yachts' LIMIT 1) WHERE category_id IS NULL`;
    await sql`UPDATE yachts_master SET type_id = (SELECT id FROM yacht_types WHERE name = 'Luxury Yacht' LIMIT 1) WHERE id IN ('majesty-66', 'azimut-55')`;
    await sql`UPDATE yachts_master SET type_id = (SELECT id FROM yacht_types WHERE name = 'Motor Yacht' LIMIT 1) WHERE type_id IS NULL`;

    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
