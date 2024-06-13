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
        Schema::create('detail_Commandes',function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('id_Commande');
            $table->unsignedBigInteger('id_Produit');
            $table->integer('quantite');
            $table->decimal('prix_un');
            $table->timestamps();
            $table->foreign('id_Commande')->references('id')->on('commandes')->onDelete('cascade');
            $table->foreign('id_Produit')->references('id')->on('produits')->onDelete('cascade');

         });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_Commandes');
    }
};
