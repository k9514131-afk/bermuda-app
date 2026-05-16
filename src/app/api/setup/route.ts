import { getDb } from '@/lib/db';
import { hashPassword, jsonResponse } from '@/lib/auth-helpers';

// GET /api/setup - Creates all tables and seeds initial data
// Call once after deployment to initialize the database
export async function GET() {
  try {
    const db = getDb();

    // Create tables
    await db.batch([
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        national_id TEXT UNIQUE,
        username TEXT UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        status TEXT DEFAULT 'active',
        nationality TEXT,
        gender TEXT,
        marital_status TEXT,
        avatar_url TEXT,
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        image_url TEXT,
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_id INTEGER REFERENCES cities(id),
        name_ar TEXT NOT NULL,
        name_en TEXT,
        description TEXT,
        stars INTEGER DEFAULT 4,
        address TEXT,
        rating REAL,
        lat REAL,
        lng REAL,
        status TEXT DEFAULT 'active',
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hotel_id INTEGER REFERENCES hotels(id),
        room_number TEXT,
        type TEXT DEFAULT 'double',
        floor INTEGER DEFAULT 1,
        base_price REAL DEFAULT 1800,
        status TEXT DEFAULT 'available',
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        hotel_id INTEGER REFERENCES hotels(id),
        room_id INTEGER REFERENCES rooms(id),
        check_in TEXT,
        check_out TEXT,
        total_price REAL,
        status TEXT DEFAULT 'Active',
        payment_status TEXT DEFAULT 'unpaid',
        reference_no TEXT UNIQUE,
        staff_notes TEXT,
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS booking_guests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER REFERENCES bookings(id),
        full_name TEXT,
        identity_no TEXT,
        guest_type TEXT DEFAULT 'adult',
        age INTEGER,
        gender TEXT,
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        event TEXT,
        details TEXT,
        ip_address TEXT,
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        title TEXT,
        message TEXT,
        type TEXT DEFAULT 'info',
        is_read INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS saved_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        card_number TEXT,
        card_holder TEXT,
        expiry TEXT,
        card_type TEXT DEFAULT 'visa',
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS payment_simulations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER,
        amount REAL,
        card_last4 TEXT,
        card_type TEXT DEFAULT 'visa',
        status TEXT DEFAULT 'pending',
        created_at TEXT,
        updated_at TEXT
      )`,
    ]);

    // Seed users
    const staffPw = await hashPassword('Abouda2004#');
    const guestPw = await hashPassword('123456');

    await db.execute({
      sql: `INSERT OR IGNORE INTO users (name, email, national_id, username, password, role, status, created_at, updated_at)
            VALUES ('Eng. Abouda Staff', 'staff@bermuda.eg', '20040701000000', 'abouda7', ?, 'staff', 'active', datetime('now'), datetime('now'))`,
      args: [staffPw],
    });
    await db.execute({
      sql: `INSERT OR IGNORE INTO users (name, email, national_id, password, role, status, created_at, updated_at)
            VALUES ('Bermuda Premium Guest', 'guest@bermuda.eg', '12345678901234', ?, 'customer', 'active', datetime('now'), datetime('now'))`,
      args: [guestPw],
    });

    // Seed cities
    const cities = [
      ['cairo', 'القاهرة', 'Cairo'],
      ['giza', 'الجيزة', 'Giza'],
      ['alexandria', 'الإسكندرية', 'Alexandria'],
      ['luxor', 'الأقصر', 'Luxor'],
      ['aswan', 'أسوان', 'Aswan'],
      ['hurghada', 'الغردقة', 'Hurghada'],
      ['sharm-el-sheikh', 'شرم الشيخ', 'Sharm El-Sheikh'],
      ['dahab', 'دهب', 'Dahab'],
      ['marsa-alam', 'مرسى علم', 'Marsa Alam'],
      ['el-gouna', 'الجونة', 'El Gouna'],
      ['matrouh', 'مرسى مطروح', 'Marsa Matrouh'],
      ['siwa', 'سيوة', 'Siwa'],
      ['ain-sokhna', 'العين السخنة', 'Ain Sokhna'],
    ];
    for (const [slug, nameAr, nameEn] of cities) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO cities (slug, name_ar, name_en, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
        args: [slug, nameAr, nameEn],
      });
    }

    // Seed hotels
    const hotels = [
      ['cairo', 'فندق النيل الملكي', 'Royal Nile Hotel', 5],
      ['giza', 'أهرام بلازا', 'Pyramids Plaza', 4],
      ['alexandria', 'كورنيش الإسكندرية', 'Alex Corniche Hotel', 4],
      ['luxor', 'قصر الأقصر', 'Luxor Palace Hotel', 5],
      ['aswan', 'أسوان جراند', 'Aswan Grand', 4],
      ['hurghada', 'بلو سي هرغادا', 'Blue Sea Hurghada', 5],
      ['sharm-el-sheikh', 'شرم ريفيرا', 'Sharm Riviera Resort', 5],
      ['dahab', 'دهب بيتش', 'Dahab Beach Stay', 4],
      ['el-gouna', 'لاجون الجونة', 'El Gouna Lagoon', 5],
      ['ain-sokhna', 'سخنة باي', 'Sokhna Bay Hotel', 4],
    ];
    for (const [citySlug, nameAr, nameEn, stars] of hotels) {
      const cityRes = await db.execute({ sql: `SELECT id FROM cities WHERE slug=? LIMIT 1`, args: [citySlug] });
      const cityId = cityRes.rows[0]?.id;
      if (!cityId) continue;
      const hotelRes = await db.execute({
        sql: `INSERT OR IGNORE INTO hotels (city_id, name_ar, name_en, description, stars, status, created_at, updated_at)
              VALUES (?, ?, ?, 'فندق مجهز للاختبار', ?, 'active', datetime('now'), datetime('now'))`,
        args: [cityId, nameAr, nameEn, stars],
      });
      const hotelId = hotelRes.lastInsertRowid ? Number(hotelRes.lastInsertRowid) : null;
      if (!hotelId) continue;

      // Add rooms to each hotel
      for (const [roomNum, type, floor, price] of [['101', 'single', 1, 1200], ['202', 'double', 2, 1800], ['303', 'suite', 3, 2600]]) {
        await db.execute({
          sql: `INSERT OR IGNORE INTO rooms (hotel_id, room_number, type, floor, base_price, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, 'available', datetime('now'), datetime('now'))`,
          args: [hotelId, roomNum, type, floor, price],
        });
      }
    }

    return jsonResponse({ message: '✅ Database initialized successfully!', tables: 'users, cities, hotels, rooms, bookings, booking_guests, audit_logs, notifications, saved_cards, payment_simulations' });
  } catch (err: unknown) {
    console.error(err);
    return jsonResponse({ message: 'Setup failed', error: String(err) }, 500);
  }
}
