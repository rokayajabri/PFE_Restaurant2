<?php

namespace Database\Factories;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Produit>
 */
class ProduitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    private static $index = 0;  // Compteur statique pour garantir l'unicité
    private static $categories; // Cache statique pour les catégories
    private static $products = [
        'Tajines' => ['Tajine de poulet', 'Tajine d\'agneau', 'Tajine de légumes'],
        'Couscous' => ['Couscous royal', 'Couscous végétarien', 'Couscous au poulet'],
        'Entrées' => ['Salade marocaine', 'Briouates', 'Harira'],
        'Desserts' => ['Baklava', 'Cornes de gazelle', 'Chebakia'],
        'Boissons' => ['Thé à la menthe', 'Jus d\'orange', 'Café arabe']
    ];

    public function __construct()
    {
        parent::__construct();
        // Initialiser les catégories une seule fois pour toutes les instances de la factory
        if (is_null(self::$categories)) {
            self::$categories = Categorie::whereIn('nom', array_keys(self::$products))->get()->keyBy('nom');
        }
    }
    public function definition(): array
    {
         // S'assurer que les catégories et les produits sont chargés
         $categoryNames = array_keys(self::$products);
         $categoryName = $categoryNames[self::$index % count($categoryNames)];
         $productList = self::$products[$categoryName];
         $productName = $productList[self::$index % count($productList)];
         self::$index++;

         $selectedCategory = self::$categories[$categoryName];
         $description = "Delicious " . strtolower($productName) . " made with traditional recipes.";

         return [
             'nom' => $productName,
             'description' => $description,
             'prix' => $this->faker->randomFloat(2, 5, 300),
             'id_Categorie' => $selectedCategory->id
         ];
    }
}
