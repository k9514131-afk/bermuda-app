<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'phone', 'national_id', 'username', 
        'password', 'role', 'status', 'nationality', 'gender',
        'marital_status', 'avatar_url'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function isAdmin() { return $this->role === 'admin'; }
    public function isStaff() { return in_array($this->role, ['staff', 'manager', 'admin']); }
    public function isCustomer() { return $this->role === 'customer'; }
}