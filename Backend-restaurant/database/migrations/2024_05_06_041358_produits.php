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
        Schema::create('produits',function(Blueprint $table){
            $table->id();
            $table->string('nom')->nullable();
            $table->string('description')->nullable();
            $table->decimal('prix')->nullable();
            $table->unsignedBigInteger('id_Categorie');
            $table->string('image')->nullable();
            $table->timestamps();
            $table->foreign('id_Categorie')->references('id')->on('categories')->onDelete('cascade');
         });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
