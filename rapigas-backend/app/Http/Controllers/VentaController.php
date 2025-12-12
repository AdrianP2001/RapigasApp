<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Cliente;
use App\Models\Producto; // Asegúrate de tener este modelo o crearlo
use Carbon\Carbon;

class VentaController extends Controller
{
    // --- NUEVO: RESUMEN PARA DASHBOARD ---
    public function resumen()
    {
        $hoy = Carbon::today();

        // 1. Total dinero vendido hoy ($)
        $totalVentas = Venta::whereDate('fecha_venta', $hoy)->sum('total');

        // 2. Contar productos (Gas vs Agua)
        // Obtenemos los detalles de las ventas de hoy
        $detalles = DetalleVenta::whereHas('venta', function ($query) use ($hoy) {
            $query->whereDate('fecha_venta', $hoy);
        })->get();

        $gas = 0;
        $agua = 0;

        foreach ($detalles as $d) {
            // Nota: Esto asume que tienes la relación 'producto' en DetalleVenta.
            // Si no, buscamos el producto manualmente para obtener el nombre.
            $prod = Producto::find($d->producto_id);
            $nombre = $prod ? strtolower($prod->nombre) : '';

            if (str_contains($nombre, 'gas')) {
                $gas += $d->cantidad;
            } elseif (str_contains($nombre, 'agua')) {
                $agua += $d->cantidad;
            }
        }

        return response()->json([
            'ventas_hoy' => $totalVentas,
            'cantidad_gas' => $gas,
            'cantidad_agua' => $agua
        ]);
    }

    // --- REGISTRAR VENTA (Tu código existente) ---
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $venta = Venta::create([
                'cliente_id' => $request->cliente_id,
                'total' => $request->total,
                'metodo_pago' => 'Efectivo',
                'fecha_venta' => now()
            ]);

            $comproGas = false;
            $comproAgua = false;

            foreach ($request->carrito as $item) {
                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $item['id'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio']
                ]);

                $nombreProd = strtolower($item['nombre']);
                if (str_contains($nombreProd, 'gas')) $comproGas = true;
                if (str_contains($nombreProd, 'agua')) $comproAgua = true;
            }

            $cliente = Cliente::find($request->cliente_id);
            if ($comproGas) $cliente->fecha_ultima_compra_gas = now();
            if ($comproAgua) $cliente->fecha_ultima_compra_agua = now();
            $cliente->save();

            return response()->json(['success' => true, 'venta_id' => $venta->id]);
        });
    }


    public function index(Request $request)
    {
        // Iniciamos la consulta incluyendo cliente y detalles
        $query = Venta::with(['cliente', 'detalles.producto'])
            ->orderBy('fecha_venta', 'desc');

        // Filtro por Fecha (Desde - Hasta)
        if ($request->desde && $request->hasta) {
            // Ajustamos 'hasta' al final del día (23:59:59)
            $hasta = Carbon::parse($request->hasta)->endOfDay();
            $query->whereBetween('fecha_venta', [$request->desde, $hasta]);
        }

        // Filtro por Cliente (Nombre)
        if ($request->cliente) {
            $query->whereHas('cliente', function ($q) use ($request) {
                $q->where('nombre', 'ilike', "%{$request->cliente}%");
            });
        }

        // Paginamos de 20 en 20 para no saturar
        return response()->json($query->paginate(20));
    }

    // --- OPCIONAL: ANULAR VENTA ---
    public function destroy($id)
    {
        // Aquí podrías implementar lógica para devolver stock si manejaras inventario
        // Por ahora, solo eliminamos el registro.
        $venta = Venta::find($id);
        if ($venta) {
            $venta->delete(); // Esto borra detalles en cascada si la DB está configurada, sino hay que borrarlos manual
            return response()->json(['message' => 'Venta anulada']);
        }
        return response()->json(['message' => 'Venta no encontrada'], 404);
    }
}
