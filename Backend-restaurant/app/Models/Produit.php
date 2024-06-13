<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'description',
        'prix',
        'id_Categorie',
        'image',
    ];
    public function compositionProduit(){
        return $this->hasMany(CompositionProduit::class);
    }
    public function detailCommande(){
        return $this->hasMany(DetailCommande::class);
    }
    public function categorie(){
        return $this->belongsTo(Categorie::class);
    }
}
