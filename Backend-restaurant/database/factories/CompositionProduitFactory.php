<?php

namespace Database\Factories;

use App\Models\Ingredient;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompositionProduit>
 */
class CompositionProduitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {  // Get all produit and ingredient IDs
        $produitIds = Produit::pluck('id')->toArray();
        $ingredientIds = Ingredient::pluck('id')->toArray();

        return [
            'id_Produit' => $this->faker->randomElement($produitIds),
            'id_Ingredient' => $this->faker->randomElement($ingredientIds),
            'quantite_necessaire' => $this->faker->randomFloat(2, 0, 100),
        ];
    }
}
