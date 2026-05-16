<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = [
        'city_id', 'name_ar', 'name_en', 'description_ar', 'description_en', 
        'stars', 'rating', 'address_ar', 'address_en', 'main_image_url', 'status'
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    /**
     * علاقة مع معرض الصور الإضافي
     */
    public function images()
    {
        return $this->hasMany(HotelImage::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
