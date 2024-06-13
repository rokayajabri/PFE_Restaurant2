<?php

namespace App\Exports;

use App\Models\Facture;
use Maatwebsite\Excel\Concerns\FromCollection;

class FacturesExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Facture::select( "id_Commande", "montant_total","datePaiement","statut","created_at")->get();;

    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function headings(): array
    {
        return ["Id_Commande", "Montant_total","datePaiement","statut","created_at"];
    }
}