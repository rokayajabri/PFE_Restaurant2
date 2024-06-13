<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Commande;
use App\Models\DetailCommande;
use App\Models\CompositionProduit;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommandeController extends Controller
{
    public function index()
    {
        try {
            // Chargez les commandes avec les informations du serveur, de la table et des détails de la commande
            $commandes = Commande::with(['serveur', 'table', 'detailCommande.produit'])->get();
            return response()->json($commandes);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération des commandes: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur interne'], 500);
        }
    }

    public function store(Request $request)
    {
        Log::info('Received data: ', $request->all()); // Pour déboguer et voir les données reçues

        // Convertir la date et préparer les données de la commande principale
        $data = $request->all();
        $data['dateCmd'] = Carbon::createFromFormat('Y-m-d\TH:i', $request->dateTimeCmd)->format('Y-m-d H:i:s');

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
                'montant_total' => $data['total'],
                'datePaiement' => $data['dateCmd'],
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
            // Optionnel: vous pouvez décider de supprimer la commande principale si les détails échouent
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

    public function show($id)
    {
        $commande = Commande::with(['table', 'serveur', 'detailCommande.produit'])->find($id);

        if (!$commande) {
            return response()->json(['message' => 'Commande not found'], 404);
        }
        return response()->json($commande);
    }

    public function update(Request $request, $id)
    {
        Log::info('Received data: ', $request->all()); // Pour déboguer et voir les données reçues

        try {
            $commande = Commande::with('detailCommande')->findOrFail($id);

            // Mise à jour des informations de la commande
            $commande->update([
                'dateCmd' => Carbon::parse($request->dateCmd)->format('Y-m-d H:i:s'),
                'statut' => $request->statut,
                'id_serveur' => $request->id_serveur,
                'id_table' => $request->id_table,
                'total' => $request->total,
                'type' => $request->type, // Ajout du champ type
            ]);

            // Récupération des IDs actuels des détails pour détecter les suppressions
            $existingIds = $commande->detailCommande->pluck('id')->toArray();
            $newIds = collect($request->details)->pluck('id')->filter()->toArray(); // Filtrer les nulls

            // Détails à supprimer
            $toDelete = array_diff($existingIds, $newIds);
            DetailCommande::destroy($toDelete);

            // Gérer les détails de la commande
            foreach ($request->details as $detailData) {
                if (isset($detailData['id'])) {
                    $detail = DetailCommande::find($detailData['id']);
                    if ($detail) {
                        $detail->update([
                            'id_Produit' => $detailData['id_Produit'],
                            'quantite' => $detailData['quantite'],
                            'prix_un' => $detailData['prix_un'],
                        ]);
                    }
                } else {
                    $commande->detailCommande()->create([
                        'id_Produit' => $detailData['id_Produit'],
                        'quantite' => $detailData['quantite'],
                        'prix_un' => $detailData['prix_un'],
                    ]);
                }
            }

            return response()->json(['message' => 'Commande updated successfully', 'commande' => $commande->load('detailCommande.produit')], 200);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour de la commande: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur interne'], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = Commande::with(['serveur', 'table', 'detailCommande.produit']);

            if ($request->filled('statut')) {
                $query->where('statut', $request->statut);
            }

            if ($request->filled('serveur_name')) {
                $query->whereHas('serveur', function ($q) use ($request) {
                    $q->where('name', 'LIKE', '%' . $request->serveur_name . '%');
                });
            }

            if ($request->filled('date_debut') && $request->filled('date_fin')) {
                $query->whereBetween('dateCmd', [$request->date_debut, $request->date_fin]);
            }

            $commandes = $query->get();

            return response()->json($commandes);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la recherche des commandes: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur interne'], 500);
        }
    }

    public function destroy($id)
    {
        $commande = Commande::with('detailCommande')->findOrFail($id);

        // Supprimez d'abord les détails de la commande pour éviter les violations de contrainte
        foreach ($commande->detailCommande as $detail) {
            $detail->delete();
        }

        // Ensuite, supprimez la commande elle-même
        $commande->delete();

        return response()->json(['message' => 'Commande deleted successfully'], 204);
    }
}
