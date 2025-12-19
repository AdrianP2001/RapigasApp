<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Cliente;
use Carbon\Carbon;

class VentaController extends Controller
{
    // 1. REGISTRAR VENTA (Sin cambios, funciona bien)
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $venta = Venta::create([
                'cliente_id' => $request->cliente_id,
                'total' => $request->total,
                'metodo_pago' => 'Efectivo',
                'fecha_venta' => now()
            ]);

            $actualizarGas = false;
            $actualizarAgua = false;

            foreach ($request->carrito as $item) {
                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $item['id'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio']
                ]);

                $nombre = strtolower($item['nombre']);
                if (str_contains($nombre, 'gas')) $actualizarGas = true;
                if (str_contains($nombre, 'agua')) $actualizarAgua = true;
            }

            if ($actualizarGas || $actualizarAgua) {
                $cliente = Cliente::find($request->cliente_id);
                if ($cliente) {
                    if ($actualizarGas) $cliente->fecha_ultima_compra_gas = now();
                    if ($actualizarAgua) $cliente->fecha_ultima_compra_agua = now();
                    $cliente->save();
                }
            }

            Cache::tags(['dashboard'])->flush();
            return response()->json(['success' => true]);
        });
    }

    // 2. Resumen con Cache Tags (Redis)
    public function resumen()
    {
        $inicio = Carbon::today();
        $fin = Carbon::today()->endOfDay();
        $cacheKey = "stats_" . $inicio->format('Ymd');

        // Usamos 'tags' para poder borrar todo el grupo 'dashboard' de un golpe
        return Cache::tags(['dashboard'])->remember($cacheKey, 3600, function () use ($inicio, $fin) {

            // Tu consulta SQL optimizada (la que hicimos antes)
            $stats = DB::table('detalle_ventas')
                ->join('ventas', 'ventas.id', '=', 'detalle_ventas.venta_id')
                ->join('productos', 'productos.id', '=', 'detalle_ventas.producto_id')
                ->whereBetween('ventas.fecha_venta', [$inicio, $fin])
                ->selectRaw("
                    COALESCE(SUM(detalle_ventas.cantidad * detalle_ventas.precio_unitario), 0) as total_dinero,
                    COALESCE(SUM(CASE WHEN productos.nombre ILIKE '%gas%' THEN detalle_ventas.cantidad ELSE 0 END), 0) as total_gas,
                    COALESCE(SUM(CASE WHEN productos.nombre ILIKE '%agua%' THEN detalle_ventas.cantidad ELSE 0 END), 0) as total_agua
                ")
                ->first();

            return [
                'ventas_hoy' => (float) $stats->total_dinero,
                'cantidad_gas' => (int) $stats->total_gas,
                'cantidad_agua' => (int) $stats->total_agua
            ];
        });
    }

    // 3. HISTORIAL (OPTIMIZADO CON SELECT)
    public function index(Request $request)
    {
        // Usamos 'select' para traer SOLO lo necesario y aligerar la carga de objetos
        $query = Venta::with([
            'cliente:id,nombre', // Solo nombre del cliente
            'detalles:id,venta_id,producto_id,cantidad', // Solo IDs y cantidad
            'detalles.producto:id,nombre' // Solo nombre del producto
        ])
            ->select('id', 'cliente_id', 'total', 'fecha_venta') // Ignoramos columnas pesadas si las hubiera
            ->orderBy('fecha_venta', 'desc');

        // Filtros Rápidos (Asegúrate de haber corrido la migración de índices)
        if ($request->desde) $query->whereDate('fecha_venta', '>=', $request->desde);
        if ($request->hasta) $query->whereDate('fecha_venta', '<=', $request->hasta);

        if ($request->cliente) {
            $query->whereHas('cliente', function ($q) use ($request) {
                $q->where('nombre', 'ilike', "%{$request->cliente}%");
            });
        }

        return response()->json($query->paginate(50));
    }

    // 4. ANULAR VENTA
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $passwordIngresada = $request->input('password');

        if (!$passwordIngresada || !Hash::check($passwordIngresada, $user->password)) {
            return response()->json(['message' => 'Contraseña incorrecta'], 403);
        }

        try {
            $venta = Venta::find($id);
            if (!$venta) return response()->json(['message' => 'Venta no encontrada'], 404);

            $venta->detalles()->delete();
            $venta->delete();

            return response()->json(['message' => 'Venta anulada correctamente']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
