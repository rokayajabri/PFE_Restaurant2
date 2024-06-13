<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Table>
 */
class TableFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombrePlace' => $this->faker->numberBetween(1, 5),
            'emplacement_X' => $this->faker->randomFloat(2, 0, 40),
            'emplacement_Y' => $this->faker->randomFloat(2, 0, 40),
        ];
    }
}
