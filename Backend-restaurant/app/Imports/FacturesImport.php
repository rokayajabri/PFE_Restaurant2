<?php

namespace App\Imports;

use App\Models\Facture;
use Maatwebsite\Excel\Concerns\ToModel;

class FacturesImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Facture([
            'id_Commande' => $row[0],
            'montant_total' => $row[1],
            'datePaiement' => $row[2],
            'statut' => $row[3],
        ]);
    }

}
