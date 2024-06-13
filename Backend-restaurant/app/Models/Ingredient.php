<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'quantite_Stock',
        'uniteMesure',
        'seuil_Reapprovisionnement',
        'supplier_id'
    ];
    public function compositionProduit(){
        return $this->hasMany(CompositionProduit::class);
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
