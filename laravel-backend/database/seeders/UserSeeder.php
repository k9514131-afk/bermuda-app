<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. إنشاء الموظف الرسمي لبرمودا abouda7
        User::updateOrCreate(
            ['username' => 'abouda7'],
            [
                'name' => 'Eng. Abouda Staff',
                'email' => 'staff@bermuda.eg',
                'password' => Hash::make('Abouda2004#'),
                'role' => 'staff',
                'status' => 'active',
                'national_id' => '20040701000000'
            ]
        );

        // 2. إنشاء عميل تجريبي لبرمودا
        User::updateOrCreate(
            ['national_id' => '12345678901234'],
            [
                'name' => 'Bermuda Premium Guest',
                'email' => 'guest@bermuda.eg',
                'password' => Hash::make('123456'),
                'role' => 'customer',
                'status' => 'active'
            ]
        );
    }
}