<?php

namespace App\Http\Controllers;

use App\Models\DetailCommande;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DetailCommandeController extends Controller
{
    // Obtenir tous les détails de commande
    public function index()
    {
        $details = DetailCommande::with('produit', 'commande')->get();
        return response()->json($details);
    }

    // Ajouter un détail à une commande existante
    public function store(Request $request)
    {
        try {
            $detail = new DetailCommande();
            $detail->id_Commande = $request->id_Commande;
            $detail->id_Produit = $request->id_Produit;
            $detail->quantite = $request->quantite;
            $detail->prix_un = $request->prix_un;
            $detail->save();

            return response()->json(['message' => 'Détail ajouté avec succès', 'detail' => $detail], 201);
        } catch (\Exception $e) {
            Log::error("Erreur lors de l'ajout du détail de la commande: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur interne'], 500);
        }
    }

    // Afficher un détail de commande spécifique
    public function show($id)
    {
        $detail = DetailCommande::with('produit', 'commande')->find($id);
        if (!$detail) {
            return response()->json(['message' => 'Détail non trouvé'], 404);
        }
        return response()->json($detail);
    }

    // Mettre à jour un détail de commande
    public function update(Request $request, $id)
    {
        try {
            $detail = DetailCommande::findOrFail($id);
            $detail->id_Produit = $request->id_Produit;
            $detail->quantite = $request->quantite;
            $detail->prix_un = $request->prix_un;
            $detail->save();

            return response()->json(['message' => 'Détail mis à jour avec succès', 'detail' => $detail], 200);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour du détail de la commande: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur interne'], 500);
        }
    }

    // Supprimer un détail de commande
    public function destroy($id)
    {
        try {
            $detail = DetailCommande::findOrFail($id);
            $detail->delete();
            return response()->json(['message' => 'Détail supprimé avec succès'], 204);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la suppression du détail de la commande: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur interne'], 500);
        }
    }
}
