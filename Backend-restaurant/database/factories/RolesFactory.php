<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class RolesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Nous pouvons utiliser un tableau pour stocker les noms des rôles
        $roles = ['Admin', 'Gerant', 'Caissier', 'Serveur', 'Cuisinier'];

        return [
            // Assigner un rôle aléatoire depuis le tableau
            'name' => $this->faker->unique()->randomElement($roles),
        ];
    }
}
