import sql from '@/app/api/utils/sql';
import { isAdminAuthorized, unauthorized } from '@/app/api/utils/auth';

export async function GET() {
  try {
    const experiences = await sql`
      SELECT * FROM experiences
      ORDER BY sort_order ASC
    `;

    const parsed = experiences.map(exp => ({
      ...exp,
      images: typeof exp.images === 'string' ? JSON.parse(exp.images) : exp.images
    }));

    return Response.json(parsed);
  } catch (error) {
    console.error('Fetch experiences error:', error);
    return Response.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, images, sort_order, is_active, keywords } = body;

    if (!(await isAdminAuthorized(request, body))) {
      return unauthorized();
    }

    const result = await sql`
      INSERT INTO experiences (title, description, images, sort_order, is_active, keywords)
      VALUES (${title}, ${description}, ${JSON.stringify(images || [])}, ${sort_order || 0}, ${is_active ?? true}, ${keywords || ''})
      RETURNING *
    `;

    const row = result[0];
    return Response.json({
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images
    }, { status: 201 });
  } catch (error) {
    console.error('Create experience error:', error);
    return Response.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
