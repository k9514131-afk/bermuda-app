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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();

    const hotelRes = await db.execute({
      sql: `SELECT h.*, c.slug as city_slug, c.name_ar as city_name_ar, c.name_en as city_name_en
            FROM hotels h LEFT JOIN cities c ON h.city_id = c.id WHERE h.id = ? LIMIT 1`,
      args: [id],
    });

    const h = hotelRes.rows[0];
    if (!h) return jsonResponse({ message: 'Hotel not found' }, 404);

    const roomsRes = await db.execute({
      sql: `SELECT * FROM rooms WHERE hotel_id = ?`,
      args: [id],
    });

    // Build room types
    const byType: Record<string, number> = {};
    for (const r of roomsRes.rows) {
      const type = String(r.type || 'double').toLowerCase();
      const price = Number(r.base_price) || 4500;
      if (!byType[type] || price < byType[type]) byType[type] = price;
    }
    const fallback = Math.min(...Object.values(byType), 4500) || 4500;
    if (!Object.keys(byType).length) {
      byType.single = Math.round(fallback * 0.7);
      byType.double = fallback;
      byType.suite = Math.round(fallback * 2.2);
    }

    const roomNameMap: Record<string, string> = { single: 'booking.single', double: 'booking.double', suite: 'booking.suite', family: 'booking.family' };
    const rooms = Object.entries(byType).map(([type, price]) => ({
      id: type,
      nameKey: roomNameMap[type] || 'booking.double',
      basePrice: price,
      baseCapacity: type === 'single' ? 1 : 2,
      maxExtraBeds: type === 'suite' ? 1 : 2,
      extraBedPrice: Math.round(price * 0.15),
      supportsChildren: type !== 'single',
    }));

    const basePrice = Math.min(...Object.values(byType)) || 4500;

    return jsonResponse({
      id: String(h.id),
      cityId: normalizeCityId(String(h.city_slug || 'cairo')),
      nameKey: String(h.name_ar || h.name_en),
      locationKey: String(h.city_name_ar || h.city_name_en || 'Egypt'),
      descriptionKey: String(h.description || 'فندق مجهز للاختبار.'),
      image: `https://picsum.photos/seed/hotel${h.id}/800/600`,
      rating: Number(h.rating) || Math.min(5, Math.max(3.8, Number(h.stars || 4) - 0.2)),
      basePrice,
      stars: Number(h.stars || 4),
      amenities: ['wifi', 'restaurant', 'parking'],
      rooms,
      mealPlans: [
        { id: 'none', nameKey: 'meal.none', pricePerPerson: 0, isIncluded: true },
        { id: 'breakfast', nameKey: 'meal.breakfast', pricePerPerson: 450, isIncluded: false },
        { id: 'half_board', nameKey: 'meal.half_board', pricePerPerson: 950, isIncluded: false },
        { id: 'full_board', nameKey: 'meal.full_board', pricePerPerson: 1600, isIncluded: false },
      ],
      lat: Number(h.lat) || 26.820611,
      lng: Number(h.lng) || 30.802498,
    });
  } catch (err) {
    console.error(err);
    return jsonResponse({ message: 'Server error' }, 500);
  }
}
