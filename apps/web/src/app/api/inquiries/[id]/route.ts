import sql from '@/app/api/utils/sql';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await sql`UPDATE inquiries SET is_deleted = true WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return Response.json({ error: 'Status is required' }, { status: 400 });
    }

    await sql`UPDATE inquiries SET status = ${status} WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error('Patch error:', error);
    return Response.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
