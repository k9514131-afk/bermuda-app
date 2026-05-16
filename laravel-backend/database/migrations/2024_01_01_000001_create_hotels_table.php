<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('cities')) {
            Schema::create('cities', function (Blueprint $header) {
                $header->id();
                $header->string('name_ar');
                $header->string('name_en');
                $header->timestamps();
            });
        }

        if (!Schema::hasTable('hotels')) {
            Schema::create('hotels', function (Blueprint $table) {
                $table->id();
                $table->foreignId('city_id')->constrained();
                $table->string('name_ar');
                $table->string('name_en');
                $table->text('description');
                $table->integer('stars')->default(5);
                $table->string('status')->default('active');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('rooms')) {
            Schema::create('rooms', function (Blueprint $table) {
                $table->id();
                $table->foreignId('hotel_id')->constrained();
                $table->string('room_number');
                $table->string('type'); // single, double, suite
                $table->decimal('base_price', 10, 2);
                $table->string('status')->default('available'); // available, occupied, cleaning, maintenance
                $table->timestamps();
            });
        }
    }
};
