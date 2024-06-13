<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        // Get all users with selected fields
        $users = User::select('id', 'name', 'email', 'address', 'age', 'gender', 'statut', 'phone', 'image')->get();

        // Add role names to each user
        $users->transform(function ($user) {
            // Get role names as string
            $roles = $user->roles->pluck('name')->implode(',');
            $user['role'] = $roles;
            return $user;
        });

        return response()->json($users);
    }

    public function serveurs()
    {
        $serveurs = User::where('role', 'serveur')->get();
        return response()->json($serveurs);
    }
    public function viewAny(User $user)
    {
        return $user->hasRole('admin'); // Example check
    }



    public function update(Request $request, $id)
    {
        $request->validate([
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            // Add other fields validation as needed
        ]);

        $user = User::findOrFail($id);

        DB::beginTransaction();
        try {
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($user->image && file_exists(public_path($user->image))) {
                    unlink(public_path($user->image));
                }

                // Process new image
                $image_name = time() . '.' . $request->image->extension();
                $request->image->move(public_path('users'), $image_name);
                $path = "/users/" . $image_name;
                $user->image = $path;
            }

            // Update only the allowed fields
            $user->fill($request->except(['image']));
            $user->save();

            DB::commit();

            return response()->json(['user' => $user, 'message' => 'User updated successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }
    public function search(Request $request)
    {
        // Récupérer le terme de recherche du formulaire
        $query = $request->get('q');

        // Rechercher des utilisateurs par nom ou email
        $users = User::where('name', 'like', "%$query%")
                     ->orWhere('email', 'like', "%$query%")
                     ->get();

        // Retourner les résultats de la recherche au format JSON
        return response()->json($users);
    }
}
