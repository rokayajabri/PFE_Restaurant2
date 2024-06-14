<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CaissierCommandeController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\CompositionProduitController;
use App\Http\Controllers\CuisinierCommandeController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\GerantCommandeController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\ServeurCommandeController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TableController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
// Routes pour les administrateurs
Route::middleware('auth:sanctum', 'admin')->group(function () {

     Route::post('/register', [AuthController::class, 'register']);
     Route::get('/users', [AdminController::class, 'index']);
     Route::put('/edit_users/{id}', [AdminController::class, 'update']);
     Route::delete('/delete_users/{id}', [AdminController::class, 'destroy']);
     Route::get('/recherche_user', [AdminController::class, 'search']);
     Route::get('/roles', [AdminController::class, 'roles']);


    Route::get('/show_commandes/{id}', [CommandeController::class, 'show']);
    Route::put('/edit_commandes/{id}', [CommandeController::class, 'update']);
    Route::delete('/delete_commandes/{id}', [CommandeController::class, 'destroy']);
    Route::get('/recherche_commande', [CommandeController::class, 'search']);
    Route::post('/add_commande', [CommandeController::class, 'store']);


});

// Routes pour les gérants
Route::middleware('auth:sanctum', 'gerant')->group(function () {
    Route::get('/gerant/commandes', [GerantCommandeController::class, 'index']);
    Route::post('/gerant/add_commandes', [GerantCommandeController::class, 'store']);
    Route::get('/gerant/show_commandes/{id}', [GerantCommandeController::class, 'show']);
    Route::put('/gerant/edit_commandes/{id}', [GerantCommandeController::class, 'update']);
    Route::delete('/gerant/delete_commandes/{id}', [GerantCommandeController::class, 'destroy']);
    Route::get('/gerant/recherche_commande', [GerantCommandeController::class, 'search']);



});

// Routes pour les cuisiniers
Route::middleware('auth:sanctum', 'cuisinier')->group(function () {
    Route::patch('/cuisinier/commandes/{id}/status', [CuisinierCommandeController::class, 'updateStatus']);

});

// Routes pour les serveurs
Route::middleware('auth:sanctum', 'serveur')->group(function () {
    Route::post('/serveur/add_commandes', [ServeurCommandeController::class, 'store']);
    Route::patch('/serveur/commandes/{id}/status', [ServeurCommandeController::class, 'updateStatus']);
});

// Routes pour les caissiers
Route::middleware('auth:sanctum', 'caissier')->group(function () {
    Route::post('/caissier/add_commandes', [CaissierCommandeController::class, 'store']);
    Route::patch('/caissier/commandes/{id}/status', [CaissierCommandeController::class, 'updateStatus']);

});


Route::middleware(['auth:sanctum', 'roles:Gerant,Caissier,Admin,Serveur,Cuisinier'])->group(function () {


    Route::get('/users/serveurs', [AdminController::class, 'serveurs']);


    Route::get('/commandes', [CommandeController::class, 'index']);

        //Product management
        Route::get('/produits', [ProduitController::class, 'index']);
        Route::delete('/delete_produits/{id}', [ProduitController::class, 'destroy']);
        Route::post('/add_produit', [ProduitController::class, 'store']);
        Route::put('/edit_produits/{id}', [ProduitController::class, 'update']);
        Route::get('/recherche_produit', [ProduitController::class, 'recherche']);
        Route::get('/produits/{id}', [ProduitController::class, 'show']);
        //Category management
        Route::get('/categories', [CategorieController::class, 'index']);
        Route::post('/add_categories', [CategorieController::class, 'store']);
        Route::put('/edit_categories/{id}', [CategorieController::class, 'update']);
        Route::delete('/delete_categories/{id}', [CategorieController::class, 'destroy']);
         Route::get('/recherche_categorie', [CategorieController::class, 'search']);
         Route::get('/categories/{id}', [CategorieController::class, 'show']);

         Route::get('/categories/{id}/products', [CategorieController::class, 'getProductsByCategory']);

        //ingredients management
        Route::get('/ingredients', [IngredientController::class, 'index']);
        Route::post('/add_ingredients', [IngredientController::class, 'store']);
        Route::put('/edit_ingredients/{id}', [IngredientController::class, 'update']);
        Route::delete('/delete_ingredients/{id}', [IngredientController::class, 'destroy']);
        Route::get('/recherche_ingredient', [IngredientController::class, 'search']);
        Route::get('/ingredients/{id}', [IngredientController::class, 'show']);
        //compositionsProduit management
        Route::get('/compositions', [CompositionProduitController::class, 'index']);
        Route::post('/add_composition', [CompositionProduitController::class, 'store']);
        Route::get('/show_compositions/{id}', [CompositionProduitController::class, 'show']);
        Route::put('/edit_compositions/{id}', [CompositionProduitController::class, 'update']);
        Route::delete('/delete_compositions/{id}', [CompositionProduitController::class, 'destroy']);
        Route::get('/recherche_composition', [CompositionProduitController::class, 'search']);
        // Tables management
        Route::get('/tables', [TableController::class, 'index']);
        Route::post('/add_table', [TableController::class, 'store']);
        Route::put('/edit_tables/{id}', [TableController::class, 'update']);
        Route::delete('/delete_tables/{id}', [TableController::class, 'destroy']);
        //Route::get('/recherche_table', [CompositionProduitController::class, 'search']);
        Route::get('/tables', [TableController::class, 'index']);
        Route::post('/add_tables', [TableController::class, 'store']);
        Route::put('/edit_tables/{table}', [TableController::class, 'update']);
        Route::delete('/delete_tables/{table}', [TableController::class, 'destroy']);

        Route::get('/tables', [TableController::class, 'index']);
        Route::post('/add_tables', [TableController::class, 'store']);
        Route::put('/edit_tables/{id}', [TableController::class, 'update']);
        Route::delete('/delete_tables/{table}', [TableController::class, 'destroy']);

        //factures management
        Route::get('/factures', [FactureController::class, 'getAllFactures']);
        Route::post('/add_facture', [FactureController::class, 'ajouterFacture']);
        Route::delete('/delete_facture/{id}', [FactureController::class, 'destroy']);
        Route::get('/recherche_facture', [FactureController::class, 'search']);
        Route::put('/edit_facture/{id}', [FactureController::class, 'update']);
        Route::post('/facture-import',[FactureController::class, 'import']);
        Route::get('/facture-export',[FactureController::class, 'export']);
        //Route::get('/generate-pdf', [FactureController::class, 'generatePDF']);
        Route::get('/download-pdf/{factureId}', [FactureController::class, 'downloadPDF']);

         //Supplier management
         Route::get('/suppliers', [SupplierController::class, 'index']);
         Route::delete('/delete_supplier/{id}', [SupplierController::class, 'destroy']);
         Route::post('/add_supplier', [SupplierController::class, 'store']);
         Route::put('/edit_supplier/{id}', [SupplierController::class, 'update']);
         Route::get('/recherche_supplier', [SupplierController::class, 'recherche']);
         Route::get('/suppliers/{id}', [SupplierController::class, 'show']);


});
