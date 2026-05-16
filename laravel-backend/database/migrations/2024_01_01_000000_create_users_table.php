<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('national_id')->unique()->nullable();
            $table->string('username')->unique()->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'staff', 'customer'])->default('customer');
            $table->enum('status', ['pending', 'active', 'suspended', 'suspended_temp'])->default('active');
            $table->string('nationality')->nullable();
            $table->string('gender')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('avatar_url')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down() { Schema::dropIfExists('users'); }
};