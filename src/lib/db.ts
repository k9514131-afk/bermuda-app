// Local JSON-based database for development (no external database required)
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize database with default data
function initializeDatabase() {
  ensureDataDir();
  
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: [
        {
          id: 1,
          username: 'abouda7',
          email: 'staff@bermuda.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYxqGyYxqGy',
          national_id: '12345678901234',
          role: 'staff',
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          email: 'customer@bermuda.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYxqGyYxqGy',
          national_id: '12345678901235',
          role: 'customer',
          status: 'active',
          created_at: new Date().toISOString()
        }
      ],
      cities: [
        { id: 1, slug: 'cairo', name_ar: 'القاهرة', name_en: 'Cairo' },
        { id: 2, slug: 'sharm', name_ar: 'شرم الشيخ', name_en: 'Sharm El Sheikh' },
        { id: 3, slug: 'hurghada', name_ar: 'الغردقة', name_en: 'Hurghada' },
        { id: 4, slug: 'alexandria', name_ar: 'الإسكندرية', name_en: 'Alexandria' },
        { id: 5, slug: 'luxor', name_ar: 'الأقصر', name_en: 'Luxor' },
        { id: 6, slug: 'aswan', name_ar: 'أسوان', name_en: 'Aswan' },
        { id: 7, slug: 'dahab', name_ar: 'دهب', name_en: 'Dahab' },
        { id: 8, slug: 'marsa-alam', name_ar: 'مرسى علم', name_en: 'Marsa Alam' },
        { id: 9, slug: 'siwa', name_ar: 'سيوة', name_en: 'Siwa' },
        { id: 10, slug: 'fayoum', name_ar: 'الفيوم', name_en: 'Fayoum' },
        { id: 11, slug: 'elgouna', name_ar: 'الجونة', name_en: 'El Gouna' },
        { id: 12, slug: 'safaga', name_ar: 'سفاجا', name_en: 'Safaga' },
        { id: 13, slug: 'nuweiba', name_ar: 'نويبع', name_en: 'Nuweiba' }
      ],
      hotels: [
        { id: 1, city_id: 1, name_ar: 'فندق القاهرة الكبرى', name_en: 'Cairo Grand Hotel', description: 'فندق فاخر في قلب القاهرة', rating: 4.5, stars: 5, status: 'active' },
        { id: 2, city_id: 2, name_ar: 'فندق شرم الشمس', name_en: 'Sharm Sun Hotel', description: 'فندق رائع على البحر الأحمر', rating: 4.3, stars: 4, status: 'active' },
        { id: 3, city_id: 3, name_ar: 'فندق الغردقة الملكي', name_en: 'Hurghada Royal Hotel', description: 'فندق ممتاز في الغردقة', rating: 4.4, stars: 5, status: 'active' },
        { id: 4, city_id: 4, name_ar: 'فندق الإسكندرية البحر', name_en: 'Alexandria Sea Hotel', description: 'فندق على البحر المتوسط', rating: 4.2, stars: 4, status: 'active' },
        { id: 5, city_id: 5, name_ar: 'فندق الأقصر القديم', name_en: 'Luxor Old Hotel', description: 'فندق تاريخي في الأقصر', rating: 4.1, stars: 4, status: 'active' }
      ],
      rooms: [
        { id: 1, hotel_id: 1, type: 'single', base_price: 3000, status: 'available' },
        { id: 2, hotel_id: 1, type: 'double', base_price: 4500, status: 'available' },
        { id: 3, hotel_id: 2, type: 'suite', base_price: 6000, status: 'available' },
        { id: 4, hotel_id: 2, type: 'double', base_price: 4000, status: 'available' },
        { id: 5, hotel_id: 3, type: 'single', base_price: 3500, status: 'available' }
      ],
      bookings: [],
      notifications: [],
      audit_logs: []
    };
    
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

// Simple query executor for JSON database
export function getDb() {
  return {
    async execute({ sql: query, args = [] }: { sql: string; args?: unknown[] }) {
      const db = initializeDatabase();
      
      // Simple SQL-like query parser for JSON database
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('select') && lowerQuery.includes('users')) {
        if (lowerQuery.includes('where')) {
          const cred = args[0] as string;
          const user = db.users.find(u => 
            u.national_id === cred || 
            u.email === cred || 
            u.username === cred
          );
          return { rows: user ? [user] : [], lastInsertRowid: null };
        }
        return { rows: db.users, lastInsertRowid: null };
      }
      
      if (lowerQuery.includes('select') && lowerQuery.includes('hotels')) {
        return { rows: db.hotels, lastInsertRowid: null };
      }
      
      if (lowerQuery.includes('select') && lowerQuery.includes('cities')) {
        return { rows: db.cities, lastInsertRowid: null };
      }
      
      if (lowerQuery.includes('select') && lowerQuery.includes('rooms')) {
        if (lowerQuery.includes('group by')) {
          const hotelPrices: Record<string, number> = {};
          db.rooms.forEach(r => {
            if (!hotelPrices[r.hotel_id] || r.base_price < hotelPrices[r.hotel_id]) {
              hotelPrices[r.hotel_id] = r.base_price;
            }
          });
          const rows = Object.entries(hotelPrices).map(([hotel_id, min_price]) => ({ hotel_id, min_price }));
          return { rows, lastInsertRowid: null };
        }
        return { rows: db.rooms, lastInsertRowid: null };
      }
      
      // Default return for other queries
      return { rows: [], lastInsertRowid: null };
    },

    async batch(queries: string[]) {
      // No-op for JSON database
    },
  };
}
