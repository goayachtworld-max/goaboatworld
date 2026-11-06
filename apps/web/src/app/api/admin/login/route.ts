import {
  isAdminPassword,
  isAdminPasswordSet,
  isAdminAuthorized,
  issueAdminToken,
  unauthorized,
} from '@/app/api/utils/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Session restore: an existing token just needs validating.
    if (body.token) {
      if (await isAdminAuthorized(request, { adminToken: body.token })) {
        return Response.json({ success: true, token: body.token });
      }
      return unauthorized();
    }

    if (!(await isAdminPasswordSet())) {
      return Response.json(
        { error: 'No admin password is set yet. Use "Forgot password" to create one.' },
        { status: 503 }
      );
    }

    if (!(await isAdminPassword(body.password))) {
      return Response.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const token = await issueAdminToken();
    return Response.json({ success: true, token });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}
