<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CityHotelSeeder extends Seeder
{
    /**
     * Seed baseline cities, hotels, and rooms for local development.
     */
    public function run(): void
    {
        $now = now();

        $cities = [
            ['slug' => 'cairo', 'name_ar' => 'القاهرة', 'name_en' => 'Cairo'],
            ['slug' => 'giza', 'name_ar' => 'الجيزة', 'name_en' => 'Giza'],
            ['slug' => 'alexandria', 'name_ar' => 'الإسكندرية', 'name_en' => 'Alexandria'],
            ['slug' => 'luxor', 'name_ar' => 'الأقصر', 'name_en' => 'Luxor'],
            ['slug' => 'aswan', 'name_ar' => 'أسوان', 'name_en' => 'Aswan'],
            ['slug' => 'hurghada', 'name_ar' => 'الغردقة', 'name_en' => 'Hurghada'],
            ['slug' => 'sharm-el-sheikh', 'name_ar' => 'شرم الشيخ', 'name_en' => 'Sharm El-Sheikh'],
            ['slug' => 'dahab', 'name_ar' => 'دهب', 'name_en' => 'Dahab'],
            ['slug' => 'marsa-alam', 'name_ar' => 'مرسى علم', 'name_en' => 'Marsa Alam'],
            ['slug' => 'el-gouna', 'name_ar' => 'الجونة', 'name_en' => 'El Gouna'],
            ['slug' => 'matrouh', 'name_ar' => 'مرسى مطروح', 'name_en' => 'Marsa Matrouh'],
            ['slug' => 'siwa', 'name_ar' => 'سيوة', 'name_en' => 'Siwa'],
            ['slug' => 'ain-sokhna', 'name_ar' => 'العين السخنة', 'name_en' => 'Ain Sokhna'],
        ];

        foreach ($cities as $city) {
            DB::table('cities')->updateOrInsert(
                ['slug' => $city['slug']],
                [
                    'name_ar' => $city['name_ar'],
                    'name_en' => $city['name_en'],
                    'image_url' => null,
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }

        $cityBySlug = DB::table('cities')->pluck('id', 'slug');

        $hotels = [
            ['city_slug' => 'cairo', 'name_ar' => 'فندق النيل الملكي', 'name_en' => 'Royal Nile Hotel', 'stars' => 5, 'address' => 'كورنيش النيل'],
            ['city_slug' => 'giza', 'name_ar' => 'أهرام بلازا', 'name_en' => 'Pyramids Plaza', 'stars' => 4, 'address' => 'طريق الأهرامات'],
            ['city_slug' => 'alexandria', 'name_ar' => 'كورنيش الإسكندرية', 'name_en' => 'Alex Corniche Hotel', 'stars' => 4, 'address' => 'كورنيش الإسكندرية'],
            ['city_slug' => 'luxor', 'name_ar' => 'قصر الأقصر', 'name_en' => 'Luxor Palace Hotel', 'stars' => 5, 'address' => 'البر الغربي'],
            ['city_slug' => 'aswan', 'name_ar' => 'أسوان جراند', 'name_en' => 'Aswan Grand', 'stars' => 4, 'address' => 'جزيرة الفنتين'],
            ['city_slug' => 'hurghada', 'name_ar' => 'بلو سي هيرغادا', 'name_en' => 'Blue Sea Hurghada', 'stars' => 5, 'address' => 'ممشى الغردقة'],
            ['city_slug' => 'sharm-el-sheikh', 'name_ar' => 'شرم ريفيرا', 'name_en' => 'Sharm Riviera Resort', 'stars' => 5, 'address' => 'خليج نعمة'],
            ['city_slug' => 'dahab', 'name_ar' => 'دهب بيتش', 'name_en' => 'Dahab Beach Stay', 'stars' => 4, 'address' => 'الممشى السياحي'],
            ['city_slug' => 'el-gouna', 'name_ar' => 'لاجون الجونة', 'name_en' => 'El Gouna Lagoon', 'stars' => 5, 'address' => 'مارينا الجونة'],
            ['city_slug' => 'ain-sokhna', 'name_ar' => 'سخنة باي', 'name_en' => 'Sokhna Bay Hotel', 'stars' => 4, 'address' => 'العين السخنة'],
        ];

        foreach ($hotels as $hotel) {
            $cityId = $cityBySlug[$hotel['city_slug']] ?? null;
            if (!$cityId) {
                continue;
            }

            DB::table('hotels')->updateOrInsert(
                ['name_en' => $hotel['name_en']],
                [
                    'city_id' => $cityId,
                    'name_ar' => $hotel['name_ar'],
                    'description' => 'Hotel prepared for local development and testing.',
                    'stars' => $hotel['stars'],
                    'address' => $hotel['address'],
                    'status' => 'active',
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }

        $hotelIds = DB::table('hotels')->pluck('id');

        foreach ($hotelIds as $hotelId) {
            foreach ([
                ['room_number' => '101', 'type' => 'single', 'floor' => 1, 'base_price' => 1200],
                ['room_number' => '202', 'type' => 'double', 'floor' => 2, 'base_price' => 1800],
                ['room_number' => '303', 'type' => 'suite', 'floor' => 3, 'base_price' => 2600],
            ] as $room) {
                DB::table('rooms')->updateOrInsert(
                    ['hotel_id' => $hotelId, 'room_number' => $room['room_number']],
                    [
                        'type' => $room['type'],
                        'floor' => $room['floor'],
                        'base_price' => $room['base_price'],
                        'status' => 'available',
                        'updated_at' => $now,
                        'created_at' => $now,
                    ]
                );
            }
        }
    }
}
