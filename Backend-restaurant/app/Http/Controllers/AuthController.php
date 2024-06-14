<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;
        // Récupérer les rôles et les permissions
        $roles = $user->roles->pluck('name')->implode(',');

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'name' => $user->name,
            'role' => $roles,
            'email' => $user->email,
        ]);
    }


    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_name' => 'required|string|exists:roles,name',
            'age' => 'required',
            'address' => 'required|string|max:255',
            'gender' => 'required|string',
            'phone' => 'required|string',
            'statut' => 'required|string',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
         // Trouver le rôle basé sur le nom fourni
         $role = Role::where('name', $validatedData['role_name'])->first();
         // Vérifier si le rôle existe
            if (!$role) {
                return response()->json(['error' => 'Role not found'], 404);
            }

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => $validatedData['role'],
            'age' => $validatedData['age'],
            'address' => $validatedData['address'],
            'gender' => $validatedData['gender'],
            'phone' => $validatedData['phone'],
            'statut' => $validatedData['statut'],
        ]);

        // Vérifier si une nouvelle image est fournie
        if ($request->hasFile('image')) {
            // Traiter l'image
            $image_name = time() . '.' . $request->image->extension();
            $request->image->move(public_path('users'), $image_name);
            $path = "/users/" . $image_name;
        } else {
            // Utiliser une image par défaut
            $path = "/users/user.png";
        }

        // Mettre à jour les détails de l'utilisateur avec l'image (par défaut ou téléchargée)
        $user->image = $path;
        $user->save(); // Sauvegarder les modifications
        // Associer l'utilisateur au rôle trouvé
        $user->roles()->attach($role->id);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }






    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();
    }
}
