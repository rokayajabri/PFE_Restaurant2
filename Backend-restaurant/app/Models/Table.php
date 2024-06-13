<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombrePlace',
        'emplacement_X',
        'emplacement_Y',
    ];
    public function commande(){
        return $this->hasMany(Commande::class);
    }
}
