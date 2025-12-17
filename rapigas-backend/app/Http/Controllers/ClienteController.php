<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cliente;

class ClienteController extends Controller
{
    public function index()
    {
        return Cliente::orderBy('nombre', 'asc')->limit(50)->get();
    }

    // --- LÓGICA ORIGINAL DE PYTHON (database.py: buscar_clientes) ---
    public function search(Request $request)
    {
        $query = $request->input('q');
        if (!$query) return response()->json([]);

        // Lógica de prefijo 593 igual que en Python
        $queryTel = $query;
        if (str_starts_with($query, '0') && strlen($query) >= 2) {
            $queryTel = '593' . substr($query, 1);
        }

        // Búsqueda flexible (Nombre O Teléfono normal O Teléfono 593)
        $clientes = Cliente::where('nombre', 'ilike', "%{$query}%")
            ->orWhere('telefono', 'ilike', "%{$query}%")
            ->orWhere('telefono', 'ilike', "%{$queryTel}%")
            ->limit(10)
            ->get();

        return response()->json($clientes);
    }

    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required', 'telefono' => 'required']);

        // Formatear teléfono a 593 si viene con 09 (Igual que Python guardar_cliente)
        $telefono = trim($request->telefono);
        if (str_starts_with($telefono, '09') && strlen($telefono) == 10) {
            $telefono = '593' . substr($telefono, 1);
        }

        $cliente = Cliente::updateOrCreate(
            ['id' => $request->id],
            [
                'nombre' => $request->nombre,
                'telefono' => $telefono,
                'direccion' => $request->direccion,
                'categoria' => $request->categoria,
                'frecuencia_consumo' => $request->frecuencia_consumo ?? 20,
                'frecuencia_agua' => $request->frecuencia_agua ?? 7,
                'fecha_modificacion' => now()
            ]
        );

        return response()->json($cliente);
    }

    public function destroy($id)
    {
        try {
            $cliente = Cliente::findOrFail($id);
            $cliente->delete();
            return response()->json(['message' => 'Cliente eliminado']);
        } catch (\Exception $e) {
            // Si falla (por ejemplo, llave foránea de ventas), devolvemos error 500
            // El frontend detectará esto y mostrará el mensaje rojo.
            return response()->json(['message' => 'No se puede eliminar'], 500);
        }
    }
}
