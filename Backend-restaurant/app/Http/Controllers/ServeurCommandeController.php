<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Commande;
use App\Models\DetailCommande;
use App\Models\CompositionProduit;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ServeurCommandeController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Received data: ', $request->all());

        $user = Auth::user();

        // Préparer les données de la commande principale
        $data = $request->all();
        $data['dateCmd'] = Carbon::now()->format('Y-m-d H:i:s');
        $data['statut'] = 'à traiter';
        $data['id_serveur'] = $user->id;
        $data['type'] = $request->type; // Ajout du champ type

        // Calculer le total
        $total = 0;
        foreach ($data['details'] as $detail) {
            $total += $detail['prix_un'] * $detail['quantite'];
        }
        $data['total'] = $total;

        // Vérifier les stocks des ingrédients
        $insufficientIngredients = [];
        $warningIngredients = [];
        foreach ($data['details'] as $detail) {
            $compositions = CompositionProduit::where('id_Produit', $detail['idProduit'])->get();
            foreach ($compositions as $composition) {
                $ingredient = Ingredient::find($composition->id_Ingredient);
                if ($ingredient) {
                    $requiredQuantity = $composition->quantite_necessaire * $detail['quantite'];
                    if ($ingredient->quantite_Stock < $requiredQuantity) {
                        $insufficientIngredients[] = $ingredient->nom;
                    } elseif (($ingredient->quantite_Stock - $requiredQuantity) < $ingredient->seuil_Reapprovisionnement) {
                        $warningIngredients[] = $ingredient->nom;
                    }
                }
            }
        }

        if (!empty($insufficientIngredients)) {
            return response()->json(['error' => 'Impossible d\'ajouter la commande car les ingrédients suivants ont une quantité insuffisante: ' . implode(', ', $insufficientIngredients)], 400);
        }

        // Créer la commande principale
        try {
            $commande = Commande::create($data);
            Log::info('Commande created: ', $commande->toArray());
        } catch (\Exception $e) {
            Log::error("Erreur lors de la création de la commande: " . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la création de la commande'], 500);
        }

        // Créer une facture associée à la commande avec le statut 'non payé'
        try {
            $facture = $commande->facture()->create([
                'montant_total' => $total,
                'datePaiement' => Carbon::now(),
                'statut' => 'non payé',
            ]);
            Log::info('Facture created: ', $facture->toArray());
        } catch (\Exception $e) {
            Log::error("Erreur lors de la création de la facture: " . $e->getMessage());
            $commande->delete();
            return response()->json(['error' => 'Erreur lors de la création de la facture'], 500);
        }

        // Vérifier si les détails de commande existent et les créer
        try {
            if (isset($data['details']) && is_array($data['details'])) {
                foreach ($data['details'] as $detail) {
                    $commande->detailCommande()->create([
                        'id_Produit' => $detail['idProduit'],
                        'quantite' => $detail['quantite'],
                        'prix_un' => $detail['prix_un']
                    ]);

                    // Deduct ingredients from stock
                    $this->deductIngredientsFromStock($detail['idProduit'], $detail['quantite']);
                }
                Log::info('Details de commande ajoutés: ', $data['details']);
            }
        } catch (\Exception $e) {
            Log::error("Erreur lors de l'ajout des détails de commande: " . $e->getMessage());
            $commande->delete();
            return response()->json(['error' => 'Erreur lors de l\'ajout des détails de la commande'], 500);
        }

        // Retourner la commande avec ses détails et la facture
        $fullCommande = Commande::with(['serveur', 'table', 'detailCommande.produit', 'facture'])->find($commande->id);

        $response = ['commande' => $fullCommande];
        if (!empty($warningIngredients)) {
            $response['warning'] = 'Les ingrédients suivants ont une quantité en stock inférieure au seuil de réapprovisionnement: ' . implode(', ', $warningIngredients);
        }

        return response()->json($response, 201);
    }

    private function deductIngredientsFromStock($produitId, $quantite)
    {
        $compositions = CompositionProduit::where('id_Produit', $produitId)->get();

        foreach ($compositions as $composition) {
            $ingredient = Ingredient::find($composition->id_Ingredient);
            if ($ingredient) {
                $ingredient->quantite_Stock -= $composition->quantite_necessaire * $quantite;
                $ingredient->save();
            }
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $commande = Commande::findOrFail($id);

            // Le serveur ne peut que mettre à jour les statuts "prête à servir" -> "en attente de paiement" et "annulée"
            if (!in_array($request->statut, ['en attente de paiement', 'annulée'])) {
                return response()->json(['error' => 'Statut invalide'], 400);
            }

            // Vérifier que la transition est valide
            if ($commande->statut === 'prête à servir' && $request->statut === 'en attente de paiement') {
                $commande->update(['statut' => $request->statut]);
            } elseif ($request->statut === 'annulée') {
                $commande->update(['statut' => $request->statut]);
            } else {
                return response()->json(['error' => 'Transition de statut invalide'], 400);
            }

            return response()->json(['message' => 'Statut de la commande mis à jour avec succès', 'commande' => $commande], 200);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour du statut de la commande: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur interne'], 500);
        }
    }
}
