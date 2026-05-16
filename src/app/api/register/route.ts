import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, jsonResponse } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, identity, email, password, phone, role, nationality, gender, marital_status } = body;

    if (!name || !identity || !email || !password) {
      return jsonResponse({ message: 'بيانات غير صالحة', errors: { required: 'name, identity, email, password' } }, 422);
    }

    const db = getDb();

    // Check uniqueness
    const exists = await db.execute({
      sql: 'SELECT id FROM users WHERE national_id = ? OR email = ? LIMIT 1',
      args: [identity, email],
    });
    if (exists.rows.length > 0) {
      return jsonResponse({ message: 'البريد الإلكتروني أو رقم الهوية مستخدم بالفعل' }, 422);
    }

    const hashed = await hashPassword(password);
    const userRole = role || 'customer';

    const result = await db.execute({
      sql: `INSERT INTO users (name, national_id, email, phone, password, role, status, nationality, gender, marital_status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [name, identity, email, phone || null, hashed, userRole, nationality || null, gender || null, marital_status || null],
    });

    return jsonResponse({
      message: 'تم إنشاء الحساب بنجاح في منظومة برمودا الملكية',
      user: { id: Number(result.lastInsertRowid), name, email, role: userRole, status: 'active' },
    }, 201);
  } catch (err) {
    console.error(err);
    return jsonResponse({ message: 'Server error' }, 500);
  }
}
