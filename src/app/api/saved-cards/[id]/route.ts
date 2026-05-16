import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, jsonResponse } from '@/lib/auth-helpers';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  const { id } = await params;
  const db = getDb();
  await db.execute({
    sql: `DELETE FROM saved_cards WHERE id=? AND user_id=?`,
    args: [id, auth.id as number],
  });
  return jsonResponse({ message: 'Card removed' });
}
