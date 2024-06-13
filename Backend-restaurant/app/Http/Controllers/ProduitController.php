<?php

namespace App\Http\Controllers;

use App\Models\CompositionProduit;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class ProduitController extends Controller
{
    public function index()
    {
        $produits = Produit::all();
        return response()->json($produits);
    }

    // Ajouter un produit
    public function store(Request $request)
{
    $validatedData = $request->validate([
        'nom' => 'required|string|max:255',
        'description' => 'nullable|string',
        'prix' => 'required|numeric',
        'id_Categorie' => 'required|exists:categories,id',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:12048',
        'ingredients' => 'required|json'
    ]);

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('public/produits');
        $validatedData['image'] = str_replace('public/', 'storage/', $path);
    }

    $produit = Produit::create($validatedData);

    $ingredients = json_decode($request->ingredients, true);

    foreach ($ingredients as $ingredientId => $ingredient) {
        CompositionProduit::create([
            'id_Produit' => $produit->id,
            'id_Ingredient' => $ingredientId,
            'quantite_necessaire' => $ingredient['quantite']
        ]);
    }

    return response()->json($produit, 201);
}


    // Récupérer un produit spécifique
    public function show($id)
    {
        $produit = Produit::with('categorie')->find($id);
        return response()->json($produit);
    }

    public function update(Request $request, $id)
    {
        try {
            // Validate incoming request data
            $validatedData = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric',
                'id_Categorie' => 'required|exists:categories,id',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:12048',
                'ingredients' => 'required|json'
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('public/produits');
                $validatedData['image'] = str_replace('public/', 'storage/', $path);
            }

            $produit = Produit::findOrFail($id);

            // Remove existing ingredients before adding new ones
            CompositionProduit::where('id_Produit', $produit->id)->delete();

            // Decode ingredients JSON
            $ingredients = json_decode($request->ingredients, true);

            foreach ($ingredients as $ingredientId => $ingredient) {
                CompositionProduit::create([
                    'id_Produit' => $produit->id,
                    'id_Ingredient' => $ingredientId,
                    'quantite_necessaire' => $ingredient['quantite']
                ]);
            }

            // Update product
            $produit->update($validatedData);

            return response()->json($produit, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors
            return response()->json(['errors' => $e->errors()], 422);
        }
    }





    // Supprimer un produit
    public function destroy($id)
    {
        $produit = Produit::findOrFail($id);
        if ($produit->image) {
            Storage::delete(str_replace('storage/', 'public/', $produit->image));
        }
        $produit->delete();
        return response()->json(null, 204);
    }

    public function recherche(Request $request)
    {
        // Récupérer le terme de recherche du formulaire
        $query = $request->get('q');

        // Recherche des produits par nom ou ID
        $produits = Produit::where('nom', 'like', "%$query%")
                           ->orWhere('id', $query)
                           ->get();

        // Retourner les résultats de la recherche au format JSON
        return response()->json($produits);
    }
}
