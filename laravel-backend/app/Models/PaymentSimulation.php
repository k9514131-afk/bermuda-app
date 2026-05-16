<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PaymentSimulation extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['customer_name', 'amount', 'temp_reference', 'status', 'payload'];

    protected $casts = [
        'payload' => 'array'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }
}