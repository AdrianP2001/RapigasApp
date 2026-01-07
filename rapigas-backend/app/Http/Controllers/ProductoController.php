<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    // 1. Listar (Solo los activos)
    public function index()
    {
        return Producto::where('activo', true)
            ->orderBy('id', 'asc')
            ->get();
    }

    // 2. Guardar (Crear nuevo)
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0'
        ]);

        // Creamos el producto forzando que esté activo
        $producto = Producto::create([
            'nombre' => $request->nombre,
            'precio' => $request->precio,
            'activo' => true,
            'es_recurrente' => false // Valor por defecto
        ]);

        return response()->json($producto, 201);
    }

    // 3. Actualizar (Editar nombre o precio)
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'string|max:255',
            'precio' => 'numeric|min:0'
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($request->all());

        return response()->json($producto);
    }

    // 4. Eliminar (Desactivación lógica)
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);

        // NO lo borramos (delete), solo lo desactivamos para mantener historial
        $producto->update(['activo' => false]);

        return response()->json(['message' => 'Producto desactivado correctamente']);
    }
}
