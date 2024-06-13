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
        Schema::create('commandes',function(Blueprint $table){
            $table->id();
            $table->dateTime('dateCmd')->nullable();
            $table->string('statut')->default('A traiter');
            $table->decimal('total')->nullable();;
            $table->unsignedBigInteger('id_serveur')->nullable();
            $table->unsignedBigInteger('id_table')->nullable();
            $table->timestamps();
            $table->foreign('id_serveur')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_table')->references('id')->on('tables')->onDelete('cascade');

         });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
