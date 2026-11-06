import sql from '@/app/api/utils/sql';
import { isAdminAuthorized, unauthorized } from '@/app/api/utils/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, images, sort_order, is_active, keywords } = body;

    if (!(await isAdminAuthorized(request, body))) {
      return unauthorized();
    }

    await sql`
      UPDATE experiences
      SET title = ${title || ''},
          description = ${description || ''},
          images = ${JSON.stringify(images || [])},
          sort_order = ${sort_order ?? 0},
          is_active = ${is_active ?? true},
          keywords = ${keywords || ''}
      WHERE id = ${id}::int
    `;
    return Response.json({ success: true });
  } catch (error) {
    console.error('Update experience error:', error);
    return Response.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!(await isAdminAuthorized(request, body))) {
      return unauthorized();
    }

    await sql`DELETE FROM experiences WHERE id = ${id}::int`;
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete experience error:', error);
    return Response.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
