<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('payment_simulations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('customer_name');
            $table->decimal('amount', 12, 2);
            $table->string('temp_reference');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->json('payload'); // تخزين بيانات الحجز كاملة لتنفيذها عند الموافقة
            $table->timestamps();
        });
    }

    public function down() { Schema::dropIfExists('payment_simulations'); }
};