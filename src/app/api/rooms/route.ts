import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, jsonResponse } from '@/lib/auth-helpers';

export async function GET() {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT r.*, h.name_ar as hotel_name FROM rooms r LEFT JOIN hotels h ON r.hotel_id = h.id ORDER BY r.hotel_id, r.room_number`,
    args: [],
  });
  return jsonResponse(result.rows);
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);

  const body = await req.json();
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO rooms (hotel_id, room_number, type, floor, base_price, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: [body.hotel_id, body.room_number, body.type || 'double', body.floor || 1, body.base_price || 1800, body.status || 'available'],
  });
  return jsonResponse({ id: Number(result.lastInsertRowid), ...body }, 201);
}
