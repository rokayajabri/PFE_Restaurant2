<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompositionProduit extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_Produit',
        'id_Ingredient',
        'quantite_necessaire',
    ];

    public function produit(){
        return $this->belongsTo(Produit::class,'id_Produit');
    }
    public function ingredient(){
        return $this->belongsTo(Ingredient::class,'id_Ingredient');
    }
}
