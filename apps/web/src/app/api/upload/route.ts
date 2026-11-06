import { NextRequest, NextResponse } from 'next/server';
import upload from '@/app/api/utils/upload';
import { isAdminAuthorized, unauthorized } from '@/app/api/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? '';

    if (contentType.includes('multipart/form-data')) {
      // Uploads are admin-only (multipart: token travels in the x-admin-token header)
      if (!(await isAdminAuthorized(request))) {
        return unauthorized();
      }

      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      // Convert File to Buffer for the upload utility
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await upload({
        buffer,
        // @ts-ignore
        projectToken: process.env.ANYTHING_PROJECT_TOKEN
      });
      if (result.error) {
        console.error('Upload utility error:', result.error);
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json({ url: result.url });
    }

    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (!(await isAdminAuthorized(request, body))) {
        return unauthorized();
      }
      const { adminToken: _adminToken, ...uploadBody } = body;
      const result = await upload({
        ...uploadBody,
        // @ts-ignore
        projectToken: process.env.ANYTHING_PROJECT_TOKEN
      });
      if (result.error) {
        console.error('Upload utility error:', result.error);
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json({ url: result.url });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
