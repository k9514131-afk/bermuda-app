<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedCard extends Model
{
    protected $fillable = [
        'user_id', 'holder_name', 'last_four', 'exp_month', 'exp_year', 
        'brand', 'cvv', 'attempts', 'lock_until'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
