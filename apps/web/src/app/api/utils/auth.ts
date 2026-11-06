import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import sql from '@/app/api/utils/sql';

// Admin sessions last 12 hours. The signing key is derived from the current
// admin password, so changing or resetting the password kills every token.
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

async function getSigningKey(): Promise<Buffer> {
  const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
  const password = cfg?.value ?? '';
  return createHash('sha256')
    .update(`gbw-admin:${password}:${process.env.ADMIN_TOKEN_SECRET ?? 'gbw-admin'}`)
    .digest();
}

async function getAdminPassword(): Promise<string | null> {
  const [cfg] = await sql`SELECT value FROM site_config WHERE key = 'admin_password'`;
  return cfg?.value ?? null;
}

export async function isAdminPasswordSet(): Promise<boolean> {
  return !!(await getAdminPassword());
}

export async function isAdminPassword(password: unknown): Promise<boolean> {
  if (typeof password !== 'string' || !password) return false;
  const stored = await getAdminPassword();
  if (!stored) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(stored);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function issueAdminToken(): Promise<string> {
  const exp = String(Date.now() + TOKEN_TTL_MS);
  const sig = createHmac('sha256', await getSigningKey()).update(`admin.${exp}`).digest();
  return `${exp}.${sig.toString('base64url')}`;
}

async function verifyAdminToken(token: unknown): Promise<boolean> {
  if (typeof token !== 'string') return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;

  const expected = createHmac('sha256', await getSigningKey())
    .update(`admin.${expStr}`)
    .digest();
  let given: Buffer;
  try {
    given = Buffer.from(sig, 'base64url');
  } catch {
    return false;
  }
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Authorize an admin API call. Reads the token from the `x-admin-token`
 * header, or from a JSON body's `adminToken` field. Pass the already-parsed
 * body when the route has one.
 */
export async function isAdminAuthorized(request: Request, body?: any): Promise<boolean> {
  const token = request.headers.get('x-admin-token') ?? body?.adminToken;
  return verifyAdminToken(token);
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
