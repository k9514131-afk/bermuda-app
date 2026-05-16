import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, jsonResponse } from '@/lib/auth-helpers';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return jsonResponse({ message: 'Unauthorized' }, 401);

  const db = getDb();
  let sql: string;
  const args: unknown[] = [];

  if (auth.role === 'staff' || auth.role === 'admin') {
    sql = `SELECT b.*, h.name_ar as hotel_name, r.room_number, r.type as room_type FROM bookings b
           LEFT JOIN hotels h ON b.hotel_id = h.id LEFT JOIN rooms r ON b.room_id = r.id
           ORDER BY b.created_at DESC`;
  } else {
    sql = `SELECT b.*, h.name_ar as hotel_name, r.room_number, r.type as room_type FROM bookings b
           LEFT JOIN hotels h ON b.hotel_id = h.id LEFT JOIN rooms r ON b.room_id = r.id
           WHERE b.user_id = ? ORDER BY b.created_at DESC`;
    args.push(auth.id as number);
  }

  const result = await db.execute({ sql, args });
  return jsonResponse(result.rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const auth = await getAuthUser(req);
    const userId = auth ? (auth.id as number) : 1;

    const { hotel_id, room_id, room_physical_id, check_in, check_out, total_price, status, isPaid, companions, id } = body;

    const db = getDb();

    // Check for overlap
    const roomId = room_physical_id || room_id;
    const overlap = await db.execute({
      sql: `SELECT id FROM bookings WHERE room_id = ? AND status = 'Active'
            AND (check_in BETWEEN ? AND ? OR check_out BETWEEN ? AND ?) LIMIT 1`,
      args: [roomId, check_in, check_out, check_in, check_out],
    });
    if (overlap.rows.length > 0) {
      return jsonResponse({ message: 'هذه الوحدة محجوزة بالفعل في هذا التاريخ' }, 422);
    }

    const ref = id || ('BER-' + Math.random().toString(36).substring(2, 10).toUpperCase());
    const result = await db.execute({
      sql: `INSERT INTO bookings (user_id, hotel_id, room_id, check_in, check_out, total_price, reference_no, status, payment_status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [userId, hotel_id, roomId, check_in, check_out, total_price, ref, status || 'Active', isPaid ? 'paid' : 'unpaid'],
    });

    const bookingId = Number(result.lastInsertRowid);

    if (companions && Array.isArray(companions)) {
      for (const c of companions) {
        await db.execute({
          sql: `INSERT INTO booking_guests (booking_id, full_name, identity_no, guest_type, age, gender, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          args: [bookingId, c.name || 'Guest', c.identity || c.idNumber || '---', c.ageType || 'adult', c.age || null, c.gender || 'male'],
        });
      }
    }

    return jsonResponse({ id: bookingId, reference_no: ref, status: status || 'Active' }, 201);
  } catch (err) {
    console.error(err);
    return jsonResponse({ message: 'Server error' }, 500);
  }
}
