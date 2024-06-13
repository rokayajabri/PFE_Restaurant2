<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailCommande extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_Commande',
        'id_Produit',
        'quantite',
        'prix_un',
    ];

    public function commande(){
        return $this->belongsTo(Commande::class, 'id_Commande');
    }
    public function produit(){
        return $this->belongsTo(Produit::class, 'id_Produit');
    }
}
