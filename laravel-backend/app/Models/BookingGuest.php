<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingGuest extends Model
{
    protected $fillable = [
        'booking_id', 'full_name', 'identity_no', 'guest_type', 'age', 'gender'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
