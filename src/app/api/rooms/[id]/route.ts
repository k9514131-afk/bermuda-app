import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, jsonResponse } from '@/lib/auth-helpers';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  const { id } = await params;
  const body = await req.json();
  const db = getDb();
  await db.execute({
    sql: `UPDATE rooms SET hotel_id=?, room_number=?, type=?, floor=?, base_price=?, status=?, updated_at=datetime('now') WHERE id=?`,
    args: [body.hotel_id, body.room_number, body.type, body.floor, body.base_price, body.status, id],
  });
  const result = await db.execute({ sql: 'SELECT * FROM rooms WHERE id=?', args: [id] });
  return jsonResponse(result.rows[0]);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = getDb();
  await db.execute({
    sql: `UPDATE rooms SET status=?, updated_at=datetime('now') WHERE id=?`,
    args: [body.status, id],
  });
  const result = await db.execute({ sql: 'SELECT * FROM rooms WHERE id=?', args: [id] });
  return jsonResponse(result.rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  const { id } = await params;
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM rooms WHERE id=?', args: [id] });
  return jsonResponse({ message: 'Room deleted' });
}
