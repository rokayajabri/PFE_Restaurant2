<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_Commande',
        'montant_total',
        'datePaiement',
        'statut',
    ];
    public function commande(){
        return $this->belongsTo(Commande::class, 'id_Commande');
    }
}
