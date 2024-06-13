<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
         \App\Models\User::factory(4)->create();
         \App\Models\Table::factory(10)->create();
         \App\Models\Categorie::factory(5)->create();
         \App\Models\Ingredient::factory(25)->create();
         \App\Models\Produit::factory(15)->create();
         \App\Models\CompositionProduit::factory(10)->create();


         $adminRole = Role::firstOrCreate(['name' => 'Admin']);

         // Create a specific user
         $user = User::create([
             'name' => 'rokaya',
             'email' => 'rokaya@gmail.com',
             'password' => bcrypt('12345678'), // or Hash::make('12345678')
         ]);

         // Assign the 'admin' role to the user using Spatie's method
         $user->assignRole($adminRole);
    }
}
