import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { jsonResponse } from '@/lib/auth-helpers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM payment_simulations WHERE id=? LIMIT 1`,
    args: [id],
  });
  if (!result.rows[0]) return jsonResponse({ message: 'Not found' }, 404);
  return jsonResponse(result.rows[0]);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = getDb();
  await db.execute({
    sql: `UPDATE payment_simulations SET status=?, updated_at=datetime('now') WHERE id=?`,
    args: [body.status, id],
  });
  const result = await db.execute({ sql: `SELECT * FROM payment_simulations WHERE id=?`, args: [id] });
  return jsonResponse(result.rows[0]);
}
