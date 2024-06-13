<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CuisinierCommandeController extends Controller
{
    public function updateStatus(Request $request, $id)
    {
        try {
            $commande = Commande::findOrFail($id);

            $currentStatus = $commande->statut;
            $newStatus = $request->statut;

            // Définir les transitions valides
            $validTransitions = [
                'à traiter' => ['en preparation', 'annulée'],
                'en preparation' => ['prête à servir', 'annulée'],
                'prête à servir' => ['annulée'],
                'en attente de paiement' => ['annulée'],
                'payée' => ['annulée'],
                'annulée' => []
            ];

            // Vérifier que la transition est valide
            if (!isset($validTransitions[$currentStatus]) || !in_array($newStatus, $validTransitions[$currentStatus])) {
                return response()->json(['error' => 'Transition de statut invalide'], 400);
            }

            // Mettre à jour le statut de la commande
            $commande->update(['statut' => $newStatus]);

            return response()->json(['message' => 'Statut de la commande mis à jour avec succès', 'commande' => $commande], 200);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour du statut de la commande: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur interne'], 500);
        }
    }
}
