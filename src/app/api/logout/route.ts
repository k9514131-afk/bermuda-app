import { NextRequest } from 'next/server';
import { getAuthUser, jsonResponse } from '@/lib/auth-helpers';

// JWT is stateless – client just discards the token
export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);
  return jsonResponse({ message: 'تم تسجيل الخروج من برمودا بنجاح' });
}
