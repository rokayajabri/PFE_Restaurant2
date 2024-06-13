<?php

namespace App\Http\Controllers;

use App\Exports\FacturesExport;
use App\Imports\FacturesImport;
use App\Models\Facture;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class FactureController extends Controller
{
    public function getAllFactures()
    {
        $factures = Facture::all();
        return response()->json($factures);
    }

        // Ajouter un facture
    public function ajouterFacture(Request $request)
    {
        $facture = Facture::create($request->all());
        return response()->json($facture, 201);
    }

     // Supprimer un produit
     public function destroy($id)
     {
         $facture = Facture::findOrFail($id);
         $facture->delete();
         return response()->json(null, 204);
     }

     public function search(Request $request)
     {
         // Récupérer le terme de recherche du formulaire
         $query = $request->get('q');

         // Recherche des produits par nom ou ID
         $facture = Facture::where('statut', 'like', "%$query%")
                            ->orWhere('id_Commande', $query)
                            ->get();

         return response()->json($facture);

     }

       // Mettre à jour un produit
    public function update(Request $request, $id)
    {
        $facture = Facture::findOrFail($id);
        $facture->update($request->all());
        return response()->json($facture, 200);
    }


     /**
    * @return \Illuminate\Support\Collection
    */
    public function export()
    {
        return Excel::download(new FacturesExport, 'factures.xlsx');
    }

    /**
    * @return \Illuminate\Support\Collection
    */

    public function import()
    {
        Excel::import(new FacturesImport,request()->file('file'));

        return back();
    }

    public function downloadPDF($factureId)
    {
        $facture = Facture::findOrFail($factureId); // Récupérer la facture spécifiée par $factureId

        $data = [
            "facture" => $facture, // Passer la facture à la vue, pas une collection de factures
        ];

        $pdf = PDF::loadView('facture-pdf', $data); // Charger la vue avec les données
        return $pdf->download('facture_'.$factureId.'.pdf'); // Télécharger le PDF
    }


}
