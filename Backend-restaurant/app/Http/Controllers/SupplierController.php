<?php
namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::all();
        return response()->json($suppliers);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:suppliers',
            'telephone' => 'required|string',
            'statut' => 'required|in:active,non active',
            'type' => 'required|in:local,international',
            'categorie' => 'required|string',  // Nouveau champ
            'entreprise' => 'required|string', // Nouveau champ
        ]);

        $supplier = Supplier::create($validatedData);

        return response()->json($supplier, 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:suppliers,email,' . $id,
            'telephone' => 'required|string',
            'statut' => 'required|in:active,non active',
            'type' => 'required|in:local,international',
            'categorie' => 'required|string',  // Nouveau champ
            'entreprise' => 'required|string', // Nouveau champ
        ]);

        $supplier = Supplier::findOrFail($id);
        $supplier->update($validatedData);

        return response()->json($supplier, 200);
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return response()->json(null, 204);
    }

    public function show($id)
    {
        $supplier = Supplier::findOrFail($id);
        return response()->json($supplier);
    }

    public function recherche(Request $request)
    {
        // Récupérer le terme de recherche du formulaire
        $query = $request->get('q');

        // Recherche des fournisseurs par nom, prénom, email, id, categorie ou entreprise
        $suppliers = Supplier::where('nom', 'like', "%$query%")
                             ->orWhere('prenom', 'like', "%$query%")
                             ->orWhere('email', 'like', "%$query%")
                             ->orWhere('telephone', 'like', "%$query%")
                             ->orWhere('id', $query)
                             ->orWhere('categorie', 'like', "%$query%")   
                             ->orWhere('entreprise', 'like', "%$query%")   
                             ->get();

        // Retourner les résultats de la recherche au format JSON
        return response()->json($suppliers);
    }
}
