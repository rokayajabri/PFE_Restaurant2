<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'categorie',  
        'entreprise',
        'statut',
        'type'
        
    ];

    public function ingredients()
    {
        return $this->hasMany(Ingredient::class);
    }
}
