<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    private function normalizeCityId(?string $slug, ?string $nameEn): string
    {
        $candidate = strtolower((string) ($slug ?: $nameEn ?: 'cairo'));
        $candidate = str_replace(' ', '-', $candidate);

        if (str_contains($candidate, 'sharm')) return 'sharm';
        if (str_contains($candidate, 'gouna')) return 'elgouna';
        if (str_contains($candidate, 'matrouh')) return 'matrouh';
        if (str_contains($candidate, 'alex')) return 'alexandria';

        return str_replace('-', '', $candidate);
    }

    private function mapRooms(\App\Models\Hotel $hotel, float $fallbackBasePrice): array
    {
        $roomNameMap = [
            'single' => 'booking.single',
            'double' => 'booking.double',
            'suite' => 'booking.suite',
            'family' => 'booking.family',
        ];

        $byType = [];
        foreach ($hotel->rooms as $room) {
            $type = strtolower((string) ($room->type ?? 'double'));
            $price = (float) ($room->base_price ?? $fallbackBasePrice);
            if (!isset($byType[$type]) || $price < $byType[$type]) {
                $byType[$type] = $price;
            }
        }

        if (empty($byType)) {
            $byType = [
                'single' => round($fallbackBasePrice * 0.7),
                'double' => round($fallbackBasePrice),
                'suite' => round($fallbackBasePrice * 2.2),
            ];
        }

        $rooms = [];
        foreach ($byType as $type => $price) {
            $rooms[] = [
                'id' => $type,
                'nameKey' => $roomNameMap[$type] ?? 'booking.double',
                'basePrice' => (float) $price,
                'baseCapacity' => $type === 'single' ? 1 : 2,
                'maxExtraBeds' => $type === 'suite' ? 1 : 2,
                'extraBedPrice' => (float) round($price * 0.15),
                'supportsChildren' => $type !== 'single',
            ];
        }

        return $rooms;
    }

    private function mapHotel(\App\Models\Hotel $hotel, bool $withDetails = false): array
    {
        $cityId = $this->normalizeCityId($hotel->city->slug ?? null, $hotel->city->name_en ?? null);
        $basePrice = (float) ($hotel->rooms->min('base_price') ?? 4500);
        if ($basePrice <= 0) {
            $basePrice = 4500;
        }

        $payload = [
            'id' => (string) $hotel->id,
            'cityId' => $cityId,
            'nameKey' => (string) ($hotel->name_ar ?: $hotel->name_en ?: 'Bermuda Hotel'),
            'locationKey' => (string) ($hotel->city->name_ar ?? $hotel->city->name_en ?? 'Egypt'),
            'descriptionKey' => (string) ($hotel->description ?: 'فندق مجهز محلياً للاختبار.'),
            'image' => 'https://picsum.photos/seed/hotel' . $hotel->id . '/800/600',
            'rating' => (float) (($hotel->rating ?? null) ?: min(5, max(3.8, ((float) ($hotel->stars ?? 4)) - 0.2))),
            'basePrice' => $basePrice,
            'amenities' => ['wifi', 'restaurant', 'parking'],
        ];

        if ($withDetails) {
            $payload['rooms'] = $this->mapRooms($hotel, $basePrice);
            $payload['mealPlans'] = [
                ['id' => 'none', 'nameKey' => 'meal.none', 'pricePerPerson' => 0, 'isIncluded' => true],
                ['id' => 'breakfast', 'nameKey' => 'meal.breakfast', 'pricePerPerson' => 450, 'isIncluded' => false],
                ['id' => 'half_board', 'nameKey' => 'meal.half_board', 'pricePerPerson' => 950, 'isIncluded' => false],
                ['id' => 'full_board', 'nameKey' => 'meal.full_board', 'pricePerPerson' => 1600, 'isIncluded' => false],
            ];
            $payload['lat'] = (float) ($hotel->lat ?? 26.820611);
            $payload['lng'] = (float) ($hotel->lng ?? 30.802498);
        }

        return $payload;
    }

    /**
     * عرض الفنادق مع فلترة حسب المدينة
     */
    public function index(Request $request)
    {
        $query = Hotel::with(['city', 'rooms']);
        
        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        $hotels = $query->get()->map(function ($hotel) {
            return $this->mapHotel($hotel, false);
        })->values();

        return response()->json($hotels);
    }

    /**
     * عرض تفاصيل فندق واحد
     */
    public function show(int|string $id)
    {
        $hotel = Hotel::with(['city', 'rooms'])->findOrFail($id);
        return response()->json($this->mapHotel($hotel, true));
    }

    /**
     * إضافة فندق جديد (التزاماً بمدن النظام الـ 13)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'name_ar' => 'required|string',
            'name_en' => 'required|string',
            'stars' => 'integer|min:1|max:5',
            'address_ar' => 'nullable|string',
        ]);

        $hotel = Hotel::create($validated);

        return response()->json(['message' => 'تم تسجيل الفندق في النظام', 'hotel' => $hotel], 201);
    }

    /**
     * تحديث بيانات فندق (مثل فنادق الجونة)
     */
    public function update(Request $request, int|string $id)
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->update($request->all());
        return response()->json(['message' => 'تم تحديث بيانات الفندق بنجاح']);
    }
}
