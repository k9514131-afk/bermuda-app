<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('saved_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('holder_name');
            $table->string('last_four');
            $table->string('exp_month');
            $table->string('exp_year');
            $table->string('brand')->default('Visa');
            $table->string('cvv');
            $table->integer('attempts')->default(0);
            $table->timestamp('lock_until')->nullable();
            $table->timestamps();
        });
    }

    public function down() { Schema::dropIfExists('saved_cards'); }
};
