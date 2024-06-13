<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ingredients',function(Blueprint $table){
            $table->id();
            $table->string('nom')->unique();
            $table->decimal('quantite_Stock')->nullable();
            $table->string('uniteMesure')->nullable();
            $table->decimal('seuil_Reapprovisionnement')->nullable();
            $table->timestamps();
         });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
