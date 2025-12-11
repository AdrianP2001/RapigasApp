<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // <-- Necesitas esto

class ProductoController extends Controller
{
    /**
     * GET /api/productos (Protegido por Sanctum)
     * * Implementa la lógica de RLS de Supabase.
     */
    public function index()
    {
        // 1. OBTENER el UUID del usuario autenticado por Laravel Sanctum.
        // Asumimos que el ID del usuario en Laravel coincide con el UUID de Supabase (auth.uid())
        $owner_uuid = auth()->id(); // Esto debería retornar el UUID del usuario logueado

        if (!$owner_uuid) {
            return response()->json(['error' => 'Usuario no autenticado en Laravel.'], 401);
        }

        try {
            // INICIO DE LA TRANSACCIÓN
            // Esto asegura que el SET LOCAL se haga justo antes de la consulta
            DB::beginTransaction();

            // 2. FORZAR la identidad en la sesión de PostgreSQL/Supabase.
            // Esto permite que el RLS vea el UUID del usuario y filtre los datos por owner_id.
            $sql_set_uid = "SET LOCAL \"auth.uid\" TO '{$owner_uuid}'";
            DB::statement($sql_set_uid);

            // 3. EJECUTAR la consulta Eloquent (la original de Python)
            // El RLS de Supabase se encarga automáticamente de agregar "WHERE owner_id = 'UUID'"
            $productos = Producto::select('id', 'nombre', 'precio', 'activo', 'owner_id')
                ->where('activo', true)
                ->orderBy('id')
                ->get();

            // FIN DE LA TRANSACCIÓN
            DB::commit();

            return response()->json($productos);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Error RLS/Productos: " . $e->getMessage());
            return response()->json(['error' => 'Error al obtener productos.'], 500);
        }
    }
}