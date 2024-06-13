<?php

namespace App\Http\Controllers;

use App\Models\CompositionProduit;
use Illuminate\Http\Request;

class CompositionProduitController extends Controller
{
    // Afficher tous les compositions
   

        public function index()
    {
        $compositions = CompositionProduit::with('produit', 'ingredient')->get();
        return response()->json($compositions);
    }

    // Ajouter une composition
    public function store(Request $request)
    {
        $composition = CompositionProduit::create($request->all());
        return response()->json($composition, 201);
    }

    // Récupérer une composition spécifique
    public function show($id)
    {
        $composition = CompositionProduit::with('produit', 'ingredient')->find($id);
        if (!$composition) {
            return response()->json(['message' => 'Composition not found'], 404);
        }
        return response()->json($composition);
    }

    // Mettre à jour une composition
    public function update(Request $request, $id)
    {
        $composition = CompositionProduit::findOrFail($id);
        $composition->update($request->all());
        return response()->json($composition, 200);
    }

    // Supprimer une composition
    public function destroy($id)
    {
        $composition = CompositionProduit::findOrFail($id);
        $composition->delete();
        return response()->json(null, 204);
    }

    // Recherche des compositions
   // CompositionProduitController.php

   public function search(Request $request) {
    $query = $request->get('q'); // Terme de recherche

    $compositions = CompositionProduit::whereHas('produit', function ($q) use ($query) {
        $q->where('nom', 'like', "%{$query}%"); // Recherche uniquement sur le nom du produit
    })->with('produit', 'ingredient')->get();

    return response()->json($compositions);
}



    
}
