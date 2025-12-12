<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Cliente;
use Carbon\Carbon;

class VentaController extends Controller
{
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            // 1. Cabecera
            $venta = Venta::create([
                'cliente_id' => $request->cliente_id,
                'total' => $request->total,
                'metodo_pago' => 'Efectivo',
                'fecha_venta' => now()
            ]);

            $actualizarGas = false;
            $actualizarAgua = false;

            // 2. Detalles y Detección de Tipo (Igual a Python)
            foreach ($request->carrito as $item) {
                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $item['id'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio']
                ]);

                // Análisis de string (Lógica de negocio original)
                $nombre = strtolower($item['nombre']);
                if (str_contains($nombre, 'gas')) $actualizarGas = true;
                if (str_contains($nombre, 'agua')) $actualizarAgua = true;
            }

            // 3. Actualizar Cliente
            if ($actualizarGas || $actualizarAgua) {
                $cliente = Cliente::find($request->cliente_id);
                if ($cliente) {
                    if ($actualizarGas) $cliente->fecha_ultima_compra_gas = now();
                    if ($actualizarAgua) $cliente->fecha_ultima_compra_agua = now();
                    $cliente->save();
                }
            }

            return response()->json(['success' => true]);
        });
    }

    // --- Dashboard y Reportes ---
    public function resumen()
    {
        $hoy = Carbon::today();

        // Suma total
        $totalVentas = Venta::whereDate('fecha_venta', $hoy)->sum('total');

        // Conteo inteligente usando DetalleVenta
        // Necesitamos unir tablas porque 'nombre' está en productos, no en detalle
        $detalles = DB::table('detalle_ventas')
            ->join('ventas', 'ventas.id', '=', 'detalle_ventas.venta_id')
            ->join('productos', 'productos.id', '=', 'detalle_ventas.producto_id')
            ->whereDate('ventas.fecha_venta', $hoy)
            ->select('detalle_ventas.cantidad', 'productos.nombre')
            ->get();

        $gas = 0;
        $agua = 0;

        foreach ($detalles as $d) {
            $n = strtolower($d->nombre);
            if (str_contains($n, 'gas')) $gas += $d->cantidad;
            elseif (str_contains($n, 'agua')) $agua += $d->cantidad;
        }

        return response()->json([
            'ventas_hoy' => $totalVentas,
            'cantidad_gas' => $gas,
            'cantidad_agua' => $agua
        ]);
    }

    // Historial
    public function index(Request $request)
    {
        $query = Venta::with(['cliente', 'detalles.producto'])->orderBy('fecha_venta', 'desc');

        if ($request->desde) $query->whereDate('fecha_venta', '>=', $request->desde);
        if ($request->hasta) $query->whereDate('fecha_venta', '<=', $request->hasta);

        return response()->json($query->paginate(20));
    }

    public function destroy($id)
    {
        $v = Venta::find($id);
        if ($v) {
            $v->delete();
            return response()->json(['msg' => 'Ok']);
        }
        return response()->json(['msg' => 'No found'], 404);
    }
}
