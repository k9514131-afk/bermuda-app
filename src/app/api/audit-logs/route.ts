import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, jsonResponse } from '@/lib/auth-helpers';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  const db = getDb();
  const result = await db.execute({ sql: `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200`, args: [] });
  return jsonResponse(result.rows);
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  const body = await req.json();
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO audit_logs (user_id, event, details, ip_address, created_at, updated_at)
          VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: [auth.id as number, body.action || body.event, body.details || '', body.ip || null],
  });
  return jsonResponse({ id: Number(result.lastInsertRowid) }, 201);
}
