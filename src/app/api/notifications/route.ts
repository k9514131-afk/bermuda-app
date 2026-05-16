import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, jsonResponse } from '@/lib/auth-helpers';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC`,
    args: [auth.id as number],
  });
  return jsonResponse(result.rows);
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  const body = await req.json();
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO notifications (user_id, title, message, type, is_read, created_at, updated_at)
          VALUES (?, ?, ?, ?, 0, datetime('now'), datetime('now'))`,
    args: [auth.id as number, body.title || '', body.message || body.body || '', body.type || 'info'],
  });
  return jsonResponse({ id: Number(result.lastInsertRowid), ...body }, 201);
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  const db = getDb();
  await db.execute({
    sql: `DELETE FROM notifications WHERE user_id=?`,
    args: [auth.id as number],
  });
  return jsonResponse({ message: 'Notifications cleared' });
}
