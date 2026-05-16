<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        if (!Schema::hasTable('cities')) {
            Schema::create('cities', function (Blueprint $table) {
                $table->id();
                $table->string('name_ar');
                $table->string('name_en');
                $table->string('slug')->unique();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('hotels')) {
            Schema::create('hotels', function (Blueprint $table) {
                $table->id();
                $table->foreignId('city_id')->constrained()->onDelete('cascade');
                $table->string('name_ar');
                $table->string('name_en');
                $table->text('description')->nullable();
                $table->integer('stars')->default(5);
                $table->string('address')->nullable();
                $table->enum('status', ['active', 'hidden', 'maintenance'])->default('active');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('rooms')) {
            Schema::create('rooms', function (Blueprint $table) {
                $table->id();
                $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
                $table->string('room_number');
                $table->enum('type', ['single', 'double', 'suite'])->default('double');
                $table->integer('floor')->default(1);
                $table->decimal('base_price', 10, 2);
                $table->enum('status', ['available', 'occupied', 'cleaning', 'maintenance'])->default('available');
                $table->unique(['hotel_id', 'room_number']);
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('hotels');
        Schema::dropIfExists('cities');
    }
};
