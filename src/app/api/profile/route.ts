import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, jsonResponse } from '@/lib/auth-helpers';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);

  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT id, name, email, phone, national_id, username, role, status, nationality, gender, marital_status, avatar_url, created_at FROM users WHERE id = ? LIMIT 1',
    args: [auth.id as number],
  });

  if (!result.rows[0]) return jsonResponse({ message: 'User not found' }, 404);
  return jsonResponse(result.rows[0]);
}
