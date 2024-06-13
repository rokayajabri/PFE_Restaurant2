<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use Spatie\Permission\Models\Role;
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

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->randomElement(['Gerant', 'Caissier', 'Serveur', 'Cuisinier']),
            'guard_name' => 'web', 
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
