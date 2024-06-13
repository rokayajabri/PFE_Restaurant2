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
        Schema::create('factures',function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('id_Commande');
            $table->decimal('montant_total');
            $table->dateTime('datePaiement')->nullable();
            $table->string('statut')->default('non payé');
            $table->timestamps();
            $table->foreign('id_Commande')->references('id')->on('commandes')->onDelete('cascade');

         });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};
