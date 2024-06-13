<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ingredient>
 */
class IngredientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     private static $index = 0;
     private static $ingredients = [
         'Poulet', 'Citrons confits', 'Olives vertes', 'Oignons', 'Ail', 'Gingembre', 'Curcuma',
         'Cumin', 'Coriandre', 'Persil', 'Safran', 'Sel', 'Poivre', 'Semoule de couscous', 'Agneau',
         'Merguez', 'Carottes', 'Courgettes', 'Navets', 'Pois chiches', 'Raisins secs', 'Ras el hanout',
         'Huile d\'olive', 'Lentilles', 'Farine', 'Céleri', 'Jus de citron', 'Viande', 'Cannelle',
         'Feuilles de brick', 'Pigeon', 'Amandes', 'Oeufs', 'Sucre glace', 'Beurre'
     ];

    public function definition(): array
    {   $name = self::$ingredients[self::$index % count(self::$ingredients)];
        self::$index++;

        return [
            'nom' => $name,
            'quantite_Stock' => $this->faker->randomFloat(2, 0, 100),
            'uniteMesure' => $this->faker->randomElement(['L', 'kg', 'ml', 'g', 'mg','Unité']),
            'seuil_Reapprovisionnement' => $this->faker->randomFloat(2, 0, 100),
        ];
    }
}
