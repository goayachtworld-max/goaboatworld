import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'`;
    return Response.json({ success: true, message: 'Migration successful' });
  } catch (error) {
    console.error('Migration failed:', error);
    return Response.json({ error: 'Migration failed' }, { status: 500 });
  }
}
