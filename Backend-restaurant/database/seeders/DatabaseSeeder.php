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
         //$adminRole = Role::firstOrCreate(['name' => 'admin']);

         // Créer des rôles directement
         $roles = ['admin', 'gerant', 'caissier', 'serveur', 'cuisinier'];

         foreach ($roles as $roleName) {
             Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
         }

         $admin = User::create([
             'name' => 'rokaya',
             'email' => 'rokaya@gmail.com',
             'password' => bcrypt('12345678'),
         ]);
         $admin->assignRole('admin');

         \App\Models\Table::factory(10)->create();
         \App\Models\Categorie::factory(5)->create();
         \App\Models\Ingredient::factory(25)->create();
         \App\Models\Produit::factory(15)->create();

         \App\Models\CompositionProduit::factory(10)->create();
        //  User::factory(4)->create();

    }
}
