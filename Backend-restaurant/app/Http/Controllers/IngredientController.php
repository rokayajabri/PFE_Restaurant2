<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function index()
    {
        $ingredients = Ingredient::with('supplier')->get();
        return response()->json($ingredients);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string',
            'quantite_Stock' => 'required|numeric',
            'uniteMesure' => 'required|string',
            'seuil_Reapprovisionnement' => 'required|numeric',
            'supplier_id' => 'nullable|exists:suppliers,id'
        ]);

        $ingredient = Ingredient::create($validatedData);

        return response()->json($ingredient->load('supplier'), 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string',
            'quantite_Stock' => 'required|numeric',
            'uniteMesure' => 'required|string',
            'seuil_Reapprovisionnement' => 'required|numeric',
            'supplier_id' => 'nullable|exists:suppliers,id'
        ]);

        $ingredient = Ingredient::findOrFail($id);
        $ingredient->update($validatedData);

        return response()->json($ingredient->load('supplier'), 200);
    }

    public function destroy($id)
    {
        $ingredient = Ingredient::findOrFail($id);
        $ingredient->delete();

        return response()->json(null, 204);
    }

    public function show($id)
    {
        $ingredient = Ingredient::with('supplier')->findOrFail($id);
        return response()->json($ingredient);
    }

    public function search(Request $request)
    {
        // Récupérer le terme de recherche du formulaire
        $query = $request->get('q');

        // Recherche des produits par nom ou ID
        $ingredients = Ingredient::with('supplier')
            ->where('nom', 'like', "%$query%")
            ->orWhere('id', $query)
            ->get();

        // Retourner les résultats de la recherche au format JSON
        return response()->json($ingredients);
    }
}