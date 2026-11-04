import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    // Add filter for soft-deleted inquiries
    await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false`;
    return Response.json({ success: true, message: 'Migration successful' });
  } catch (error) {
    console.error('Migration failed:', error);
    return Response.json({ error: 'Migration failed' }, { status: 500 });
  }
}
