import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { jsonResponse } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();
    const result = await db.execute({
      sql: `INSERT INTO payment_simulations (booking_id, amount, card_last4, card_type, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))`,
      args: [body.booking_id || null, body.amount || 0, body.card_last4 || '0000', body.card_type || 'visa'],
    });
    return jsonResponse({ id: Number(result.lastInsertRowid), status: 'pending' }, 201);
  } catch (err) {
    console.error(err);
    return jsonResponse({ message: 'Server error' }, 500);
  }
}
