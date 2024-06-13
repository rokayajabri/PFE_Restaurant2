<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TableController extends Controller
{
    public function index()
    {
        return Table::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombrePlace' => 'required|integer',
            'emplacement_X' => 'required|integer',
            'emplacement_Y' => 'required|integer',
        ]);

        return Table::create($validated);
    }

    public function update(Request $request, $id)
    {
        // Validate the request data
        $validated = $request->validate([
            'nombrePlace' => 'required|integer',
            'emplacement_X' => 'required|numeric',
            'emplacement_Y' => 'required|numeric',
        ]);

        // Find the table by ID and update its attributes
        $table = Table::findOrFail($id);
        $table->update($validated);

        // Return the updated table data as JSON response
        return response()->json($table, 200);
    }



    public function destroy(Table $table)
    {
        $table->delete();
        return response()->noContent();
    }
}
