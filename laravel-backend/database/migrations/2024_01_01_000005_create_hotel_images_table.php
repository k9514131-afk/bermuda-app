<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('hotel_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->string('image_url');
            $table->string('caption')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // إضافة عمود الصورة الرئيسية لجدول الفنادق
        Schema::table('hotels', function (Blueprint $table) {
            $table->string('main_image_url')->nullable()->after('address_en');
        });
    }

    public function down() { 
        Schema::dropIfExists('hotel_images'); 
    }
};
