<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        if (!Schema::hasTable('hotels')) {
            Schema::create('hotels', function (Blueprint $table) {
                $table->id();
                $table->foreignId('city_id')->constrained()->onDelete('cascade');
                $table->string('name_ar');
                $table->string('name_en');
                $table->text('description_ar')->nullable();
                $table->text('description_en')->nullable();
                $table->integer('stars')->default(5);
                $table->decimal('rating', 3, 2)->default(4.5);
                $table->string('address_ar')->nullable();
                $table->string('address_en')->nullable();
                $table->enum('status', ['active', 'hidden', 'maintenance'])->default('active');
                $table->timestamps();
            });
        }
    }

    public function down() { Schema::dropIfExists('hotels'); }
};
