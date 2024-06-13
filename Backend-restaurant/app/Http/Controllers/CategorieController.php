<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CategorieController extends Controller
{
    public function index()
    {
        $categories = Categorie::all();
        return response()->json($categories);
    }

    public function getProductsByCategory($id) {
        $products = Produit::where('id_Categorie', $id)->get();
        return response()->json($products);
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|unique:categories|max:255',
            'description' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('public/categories');
            $validatedData['image'] = str_replace('public/', 'storage/', $path);
        }

        $categorie = Categorie::create($validatedData);

        return response()->json($categorie, 201);
    }

    public function show($id)
    {
        $categorie = Categorie::findOrFail($id);
        return response()->json($categorie);
    }


    public function update(Request $request, $id)
    {
        Log::info('Update method called');
        $categorie = Categorie::findOrFail($id);

        Log::info('Category found', ['category' => $categorie]);

        // Afficher toutes les données reçues
        $requestData = $request->all();
        Log::info('Request data', $requestData);
        dd($requestData);

        // Valider les données de la requête
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);


        Log::info('Data validated');

        // Vérifier si une nouvelle image est fournie
        if ($request->hasFile('image')) {
            Log::info('Image file detected');
            $image_name = time() . '.' . $request->image->extension();
            Log::info('Image name: ' . $image_name);
            $request->image->move(public_path('categories'), $image_name);
            Log::info('Image moved to public/categories');
            $path = "/categories/" . $image_name;
            $categorie->image = $path;
        } else {
            Log::info('No image file detected');
        }

        // Mettre à jour les autres champs

        // Mettre à jour les champs
        $categorie->fill($validatedData);

        // Sauvegarder les modifications
        $categorie->save();

        Log::info('Category saved', ['category' => $categorie]);

        return response()->json($categorie);
    }


    public function destroy($id)
    {
        $categorie = Categorie::findOrFail($id);
        if ($categorie->image) {
            Storage::delete(str_replace('storage/', 'public/', $categorie->image));
        }
        $categorie->delete();

        return response()->json(null, 204);
    }

    public function search(Request $request)
    {
        $query = $request->get('q');

        // Vérifiez d'abord si le terme de recherche est un nombre
        // Si c'est le cas, recherchez uniquement par ID
        if (is_numeric($query)) {
            $categories = Categorie::where('id', $query)->get();
        } else {
            // Sinon, recherchez par nom
            $categories = Categorie::where('nom', 'like', "%$query%")->get();
        }

        return response()->json($categories);
    }
}
