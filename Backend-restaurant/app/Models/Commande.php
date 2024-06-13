<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;
    protected $fillable = [
        'dateCmd',
        'statut',
        'total',
        'id_serveur',
        'id_table',
        'type'
    ];

    public function table(){
        return $this->belongsTo(Table::class,'id_table');
    }
   
    public function serveur(){
        return $this->belongsTo(User::class, 'id_serveur');
    }

    public function detailCommande(){
        return $this->hasMany(DetailCommande::class, 'id_Commande');
    }
    public function facture(){
        return $this->hasOne(Facture::class, 'id_Commande');
    }
}
