// Local JSON-based database for development (no external database required)
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

// Cache for database data to improve performance
let dbCache: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5000; // 5 seconds

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load database with caching
function loadDatabase(): any {
  const now = Date.now();
  if (dbCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return dbCache;
  }
  
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  dbCache = data;
  cacheTimestamp = now;
  return data;
}

// Save database and update cache
function saveDatabase(data: any): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  dbCache = data;
  cacheTimestamp = Date.now();
}

// Initialize database with default data (sync version)
function initializeDatabase() {
  ensureDataDir();
  
  if (!fs.existsSync(DB_FILE)) {
    // Hash passwords synchronously
    const staffPassword = bcrypt.hashSync('Abouda2004#', 12);
    const customerPassword = bcrypt.hashSync('123456', 12);
    
    const defaultData = {
      users: [
        {
          id: 1,
          username: 'abouda7',
          email: 'staff@bermuda.com',
          password: staffPassword,
          national_id: '12345678901234',
          role: 'staff',
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          email: 'customer@bermuda.com',
          password: customerPassword,
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
      booking_guests: [],
      notifications: [],
      audit_logs: [],
      payment_simulations: [],
      saved_cards: []
    };
    
    saveDatabase(defaultData);
    return defaultData;
  }
  
  return loadDatabase();
}

// Simple query executor for JSON database (sync version)
export function getDb() {
  const db = loadDatabase();
  
  return {
    async execute({ sql: query, args = [] }: { sql: string; args?: unknown[] }) {
      // Simple SQL-like query parser for JSON database
      const lowerQuery = query.toLowerCase();
      
      // Handle SELECT queries
      if (lowerQuery.includes('select')) {
        // Users table
        if (lowerQuery.includes('users')) {
          if (lowerQuery.includes('where')) {
            const cred = args[0] as string;
            const user = db.users.find((u: any) => 
              u.national_id === cred || 
              u.email === cred || 
              u.username === cred
            );
            return { rows: user ? [user] : [], lastInsertRowid: null };
          }
          return { rows: db.users, lastInsertRowid: null };
        }
        
        // Hotels table
        if (lowerQuery.includes('hotels')) {
          if (lowerQuery.includes('left join')) {
            // Handle JOIN with cities
            const hotelsWithCities = db.hotels.map((h: any) => ({
              ...h,
              city_slug: db.cities.find((c: any) => c.id === h.city_id)?.slug || null,
              city_name_ar: db.cities.find((c: any) => c.id === h.city_id)?.name_ar || null,
              city_name_en: db.cities.find((c: any) => c.id === h.city_id)?.name_en || null,
            }));
            
            if (lowerQuery.includes('where') && lowerQuery.includes('c.slug')) {
              const citySlug = args[0] as string;
              return { rows: hotelsWithCities.filter((h: any) => h.city_slug === citySlug), lastInsertRowid: null };
            }
            return { rows: hotelsWithCities, lastInsertRowid: null };
          }
          return { rows: db.hotels, lastInsertRowid: null };
        }
        
        // Cities table
        if (lowerQuery.includes('cities')) {
          return { rows: db.cities, lastInsertRowid: null };
        }
        
        // Rooms table
        if (lowerQuery.includes('rooms')) {
          if (lowerQuery.includes('left join')) {
            // Handle JOIN with hotels
            const roomsWithHotels = db.rooms.map((r: any) => ({
              ...r,
              hotel_name: db.hotels.find((h: any) => h.id === r.hotel_id)?.name_ar || null,
            }));
            return { rows: roomsWithHotels, lastInsertRowid: null };
          }
          if (lowerQuery.includes('group by')) {
            const hotelPrices: Record<string, number> = {};
            db.rooms.forEach((r: any) => {
              if (!hotelPrices[r.hotel_id] || r.base_price < hotelPrices[r.hotel_id]) {
                hotelPrices[r.hotel_id] = r.base_price;
              }
            });
            const rows = Object.entries(hotelPrices).map(([hotel_id, min_price]) => ({ hotel_id, min_price }));
            return { rows, lastInsertRowid: null };
          }
          return { rows: db.rooms, lastInsertRowid: null };
        }
        
        // Bookings table
        if (lowerQuery.includes('bookings')) {
          if (lowerQuery.includes('left join')) {
            // Handle JOIN with hotels, rooms, and guests
            const bookingsWithDetails = db.bookings.map((b: any) => ({
              ...b,
              hotel_name: db.hotels.find((h: any) => h.id === b.hotel_id)?.name_ar || null,
              room_number: db.rooms.find((r: any) => r.id === b.room_id)?.room_number || null,
              room_type: db.rooms.find((r: any) => r.id === b.room_id)?.type || null,
            }));
            return { rows: bookingsWithDetails, lastInsertRowid: null };
          }
          return { rows: db.bookings, lastInsertRowid: null };
        }
        
        // Notifications table
        if (lowerQuery.includes('notifications')) {
          return { rows: db.notifications, lastInsertRowid: null };
        }
        
        // Audit logs table
        if (lowerQuery.includes('audit_logs')) {
          return { rows: db.audit_logs, lastInsertRowid: null };
        }
        
        // Payment simulations table
        if (lowerQuery.includes('payment_simulations')) {
          return { rows: db.payment_simulations || [], lastInsertRowid: null };
        }
        
        // Saved cards table
        if (lowerQuery.includes('saved_cards')) {
          return { rows: db.saved_cards || [], lastInsertRowid: null };
        }
      }
      
      // Handle INSERT queries
      if (lowerQuery.includes('insert')) {
        let newId = 1;
        
        // Users table
        if (lowerQuery.includes('users')) {
          newId = Math.max(...db.users.map((u: any) => u.id), 0) + 1;
          const newUser: any = {
            id: newId,
            name: args[0],
            national_id: args[1],
            email: args[2],
            phone: args[3],
            password: args[4],
            role: args[5],
            status: args[6],
            nationality: args[7],
            gender: args[8],
            marital_status: args[9],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          db.users.push(newUser);
          fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
          return { rows: [], lastInsertRowid: newId };
        }
        
        // Bookings table
        if (lowerQuery.includes('bookings')) {
          newId = Math.max(...db.bookings.map((b: any) => b.id || 0), 0) + 1;
          const newBooking: any = {
            id: newId,
            user_id: args[0],
            hotel_id: args[1],
            room_id: args[2],
            check_in: args[3],
            check_out: args[4],
            total_price: args[5],
            reference_no: args[6],
            status: args[7],
            payment_status: args[8],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          db.bookings.push(newBooking);
          saveDatabase(db);
          return { rows: [], lastInsertRowid: newId };
        }
        
        // Rooms table
        if (lowerQuery.includes('rooms')) {
          newId = Math.max(...db.rooms.map((r: any) => r.id), 0) + 1;
          const newRoom: any = {
            id: newId,
            hotel_id: args[0],
            room_number: args[1],
            type: args[2],
            floor: args[3],
            base_price: args[4],
            status: args[5],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          db.rooms.push(newRoom);
          saveDatabase(db);
          return { rows: [], lastInsertRowid: newId };
        }
        
        // Notifications table
        if (lowerQuery.includes('notifications')) {
          newId = Math.max(...db.notifications.map((n: any) => n.id || 0), 0) + 1;
          const newNotification: any = {
            id: newId,
            user_id: args[0],
            title: args[1],
            message: args[2],
            type: args[3],
            is_read: args[4],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          db.notifications.push(newNotification);
          saveDatabase(db);
          return { rows: [], lastInsertRowid: newId };
        }
        
        // Booking guests table
        if (lowerQuery.includes('booking_guests')) {
          newId = Math.max(...(db.booking_guests || []).map((g: any) => g.id || 0), 0) + 1;
          if (!db.booking_guests) db.booking_guests = [];
          const newGuest: any = {
            id: newId,
            booking_id: args[0],
            full_name: args[1],
            identity_no: args[2],
            guest_type: args[3],
            phone: args[4],
            nationality: args[5],
            age: args[6],
            gender: args[7],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          db.booking_guests.push(newGuest);
          saveDatabase(db);
          return { rows: [], lastInsertRowid: newId };
        }
      }
      
      // Handle UPDATE queries
      if (lowerQuery.includes('update')) {
        // Rooms table
        if (lowerQuery.includes('rooms')) {
          const roomId = args[args.length - 1];
          const room = db.rooms.find((r: any) => r.id === roomId);
          if (room) {
            if (lowerQuery.includes('status')) {
              room.status = args[0];
            } else {
              room.hotel_id = args[0];
              room.room_number = args[1];
              room.type = args[2];
              room.floor = args[3];
              room.base_price = args[4];
              room.status = args[5];
            }
            room.updated_at = new Date().toISOString();
            saveDatabase(db);
          }
          return { rows: [], lastInsertRowid: null };
        }
        
        // Payment simulations table
        if (lowerQuery.includes('payment_simulations')) {
          const simId = args[args.length - 1];
          if (!db.payment_simulations) db.payment_simulations = [];
          const sim = db.payment_simulations.find((s: any) => s.id === simId);
          if (sim) {
            sim.status = args[0];
            sim.updated_at = new Date().toISOString();
            saveDatabase(db);
          }
          return { rows: [], lastInsertRowid: null };
        }
      }
      
      // Handle DELETE queries
      if (lowerQuery.includes('delete')) {
        // Rooms table
        if (lowerQuery.includes('rooms')) {
          const roomId = args[0];
          db.rooms = db.rooms.filter((r: any) => r.id !== roomId);
          saveDatabase(db);
          return { rows: [], lastInsertRowid: null };
        }
        
        // Saved cards table
        if (lowerQuery.includes('saved_cards')) {
          const cardId = args[0];
          const userId = args[1];
          if (!db.saved_cards) db.saved_cards = [];
          db.saved_cards = db.saved_cards.filter((c: any) => c.id !== cardId);
          saveDatabase(db);
          return { rows: [], lastInsertRowid: null };
        }
        
        // Notifications table
        if (lowerQuery.includes('notifications')) {
          const userId = args[0];
          db.notifications = db.notifications.filter((n: any) => n.user_id !== userId);
          saveDatabase(db);
          return { rows: [], lastInsertRowid: null };
        }
      }
      
      // Default return for other queries
      return { rows: [], lastInsertRowid: null };
    },

    async batch(queries: string[]) {
      // No-op for JSON database
    },
  };
}
