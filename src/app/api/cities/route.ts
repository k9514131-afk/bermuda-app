import { getDb } from '@/lib/db';
import { jsonResponse } from '@/lib/auth-helpers';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute({ sql: 'SELECT * FROM cities ORDER BY name_ar', args: [] });
    return jsonResponse(result.rows);
  } catch (err) {
    console.error(err);
    return jsonResponse({ message: 'Server error' }, 500);
  }
}
