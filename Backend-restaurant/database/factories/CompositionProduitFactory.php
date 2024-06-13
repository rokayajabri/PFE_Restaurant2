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
    {
        return [
            'id_Produit' => Produit::factory(),
            'id_Ingredient' => Ingredient::factory(),
            'quantite_necessaire' => $this->faker->randomFloat(2, 0, 100),
        ];
    }
}
