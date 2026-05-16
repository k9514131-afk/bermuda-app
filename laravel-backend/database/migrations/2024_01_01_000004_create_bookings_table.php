<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        if (!Schema::hasTable('bookings')) {
            Schema::create('bookings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained();
                $table->foreignId('hotel_id')->constrained();
                $table->foreignId('room_id')->constrained();
                $table->date('check_in');
                $table->date('check_out');
                $table->decimal('total_price', 12, 2);
                $table->enum('status', ['Active', 'Cancelled', 'Completed'])->default('Active');
                $table->string('reference_no')->unique();
                $table->string('source')->default('customer'); // customer or staff
                $table->timestamps();
            });
        }
    }

    public function down() { Schema::dropIfExists('bookings'); }
};
