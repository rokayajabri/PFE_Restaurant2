<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Categorie>
 */
class CategorieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categorie = ['Tajines', 'Couscous', 'Entrées', 'Desserts', 'Boissons'];
        $categorie_name = $this->faker->unique()->randomElement($categorie);
        $description = "Delicious " . strtolower($categorie_name) . " made with traditional recipes.";
        return [
            'nom' => $categorie_name,
            'description' => $description,
        ];
    }
}
