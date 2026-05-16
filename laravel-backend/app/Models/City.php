<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = ['name_ar', 'name_en', 'slug', 'image_url'];

    public function hotels()
    {
        return $this->hasMany(Hotel::class);
    }
}
