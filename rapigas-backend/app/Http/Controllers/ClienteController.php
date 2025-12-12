<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cliente;

class ClienteController extends Controller
{
    // 1. Obtener lista de clientes (Limitada a 50 para no saturar, igual que Python)
    public function index()
    {
        return Cliente::orderBy('nombre', 'asc')->limit(50)->get();
    }

    // 2. Buscar clientes (Ya lo teníamos)
    public function search(Request $request)
    {
        $query = $request->input('q');
        if (!$query) return response()->json([]);

        return Cliente::where('nombre', 'ilike', "%{$query}%")
            ->orWhere('telefono', 'like', "%{$query}%")
            ->limit(20)
            ->get();
    }

    // 3. Guardar o Actualizar (La lógica "guardar_cliente" de Python)
    public function store(Request $request)
    {
        // Validaciones
        $request->validate([
            'nombre' => 'required',
            'telefono' => 'required|min:10', // Validación de longitud
            'categoria' => 'required'
        ]);

        // Verificar duplicados solo si es nuevo
        if (!$request->id) {
            $existe = Cliente::where('telefono', $request->telefono)->exists();
            if ($existe) {
                return response()->json(['message' => '⚠️ Este número ya está registrado'], 409); // Conflict
            }
        }

        // Guardar (Create or Update)
        $cliente = Cliente::updateOrCreate(
            ['id' => $request->id], // Si trae ID, busca y actualiza
            [
                'nombre' => $request->nombre,
                'telefono' => $request->telefono,
                'direccion' => $request->direccion,
                'categoria' => $request->categoria,
                'frecuencia_consumo' => $request->frecuencia_consumo ?? 20,
                'frecuencia_agua' => $request->frecuencia_agua ?? 7,
                'fecha_modificacion' => now()
            ]
        );

        return response()->json($cliente);
    }

    // 4. Eliminar Cliente
    public function destroy($id)
    {
        try {
            $cliente = Cliente::findOrFail($id);
            $cliente->delete();
            return response()->json(['message' => 'Cliente eliminado']);
        } catch (\Exception $e) {
            // Si falla (por ejemplo, tiene ventas asociadas), devolvemos error
            return response()->json(['message' => '❌ No se puede eliminar (tiene historial de ventas)'], 500);
        }
    }
}
