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
        Schema::create('composition_produits',function(Blueprint $table){
            $table->id();
            $table->decimal('quantite_necessaire')->nullable();
            $table->unsignedBigInteger('id_Produit')->nullable();
            $table->unsignedBigInteger('id_Ingredient')->nullable();
            $table->timestamps();
            $table->foreign('id_Produit')->references('id')->on('produits')->onDelete('cascade');
            $table->foreign('id_Ingredient')->references('id')->on('ingredients')->onDelete('cascade');

         });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('composition_Produits');
    }
};
