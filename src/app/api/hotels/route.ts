import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { jsonResponse } from '@/lib/auth-helpers';

function normalizeCityId(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes('sharm')) return 'sharm';
  if (s.includes('gouna') || s.includes('el-gouna')) return 'elgouna';
  if (s.includes('matrouh') || s.includes('marsa-m')) return 'matrouh';
  if (s.includes('alex')) return 'alexandria';
  return s.replace(/-/g, '');
}

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const citySlug = searchParams.get('city');

    let sql = `SELECT h.*, c.slug as city_slug, c.name_ar as city_name_ar, c.name_en as city_name_en
               FROM hotels h LEFT JOIN cities c ON h.city_id = c.id WHERE h.status = 'active'`;
    const args: unknown[] = [];

    if (citySlug) {
      sql += ' AND c.slug = ?';
      args.push(citySlug);
    }

    const hotels = await db.execute({ sql, args });
    const roomPrices = await db.execute({
      sql: `SELECT hotel_id, MIN(base_price) as min_price FROM rooms GROUP BY hotel_id`,
      args: [],
    });

    const priceMap: Record<string, number> = {};
    for (const r of roomPrices.rows) {
      priceMap[String(r.hotel_id)] = Number(r.min_price) || 4500;
    }

    const mapped = hotels.rows.map((h) => {
      const basePrice = priceMap[String(h.id)] || 4500;
      return {
        id: String(h.id),
        cityId: normalizeCityId(String(h.city_slug || 'cairo')),
        nameKey: String(h.name_ar || h.name_en),
        locationKey: String(h.city_name_ar || h.city_name_en || 'Egypt'),
        descriptionKey: String(h.description || 'فندق مجهز للاختبار.'),
        image: `https://picsum.photos/seed/hotel${h.id}/800/600`,
        rating: Number(h.rating) || Math.min(5, Math.max(3.8, Number(h.stars || 4) - 0.2)),
        basePrice,
        amenities: ['wifi', 'restaurant', 'parking'],
        stars: Number(h.stars || 4),
      };
    });

    return jsonResponse(mapped);
  } catch (err) {
    console.error(err);
    return jsonResponse({ message: 'Server error' }, 500);
  }
}
