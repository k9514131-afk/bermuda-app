import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, jsonResponse } from '@/lib/auth-helpers';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM saved_cards WHERE user_id=? ORDER BY created_at DESC`,
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
    sql: `INSERT INTO saved_cards (user_id, card_number, card_holder, expiry, card_type, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: [auth.id as number, body.card_number || body.cardNumber, body.card_holder || body.cardHolder, body.expiry, body.card_type || body.cardType || 'visa'],
  });
  return jsonResponse({ id: Number(result.lastInsertRowid), ...body }, 201);
}
