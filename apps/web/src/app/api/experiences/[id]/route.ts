import sql from '@/app/api/utils/sql';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { adminPassword, title, description, images, sort_order, is_active, keywords } = body;

    // Verify admin password
    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sql`
      UPDATE experiences
      SET title = ${title},
          description = ${description},
          images = ${JSON.stringify(images)},
          sort_order = ${sort_order},
          is_active = ${is_active},
          keywords = ${keywords}
      WHERE id = ${id}
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
    const { adminPassword } = body;

    // Verify admin password
    const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
    if (!cfg || cfg.value !== adminPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sql`DELETE FROM experiences WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete experience error:', error);
    return Response.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
