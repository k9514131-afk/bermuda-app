import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPassword, createToken, jsonResponse } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, credential, username, email, national_id } = body;

    if (!password) return jsonResponse({ message: 'كلمة المرور مطلوبة' }, 422);

    const cred = credential || username || email || national_id;
    if (!cred) return jsonResponse({ message: 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني.' }, 422);

    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE national_id = ? OR email = ? OR username = ? LIMIT 1',
      args: [cred, cred, cred],
    });

    const user = result.rows[0];
    if (!user) return jsonResponse({ message: 'عذراً، بيانات الدخول غير صحيحة ملوكي.' }, 401);

    const valid = await checkPassword(String(password), String(user.password));
    if (!valid) return jsonResponse({ message: 'عذراً، بيانات الدخول غير صحيحة ملوكي.' }, 401);

    if (user.status === 'suspended') {
      return jsonResponse({ message: 'هذا الحساب موقوف حالياً من قِبل إدارة برمودا' }, 403);
    }

    const token = await createToken({ id: user.id, role: user.role, email: user.email });

    const { password: _pw, ...safeUser } = Object.fromEntries(
      Object.entries(user).map(([k, v]) => [k, v])
    );

    return jsonResponse({ user: safeUser, access_token: token, message: 'تم الدخول لمنظومة برمودا بنجاح' });
  } catch (err) {
    console.error(err);
    return jsonResponse({ message: 'Server error' }, 500);
  }
}
