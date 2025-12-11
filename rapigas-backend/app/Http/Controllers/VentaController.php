<?php

namespace App\Http\Controllers; // <--- NAMESPACE CORRECTO

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Venta;         // <--- IMPORTAR MODELOS
use App\Models\DetalleVenta;  // <--- IMPORTAR MODELOS
use App\Models\Cliente;       // <--- IMPORTAR MODELOS

class VentaController extends Controller // <--- CLASE DEBE EXTENDER CONTROLLER
{


    public function store(Request $request)
    {
        // $request trae: cliente_id, carrito (array), total, metodo_pago

        return DB::transaction(function () use ($request) {
            // 1. Crear Venta
            $venta = Venta::create([
                'cliente_id' => $request->cliente_id,
                'total' => $request->total,
                'metodo_pago' => 'Efectivo', // O dinámico
                'fecha_venta' => now()
            ]);

            $comproGas = false;
            $comproAgua = false;

            // 2. Insertar Detalles
            foreach ($request->carrito as $item) {
                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $item['id'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio']
                ]);

                // Detección de tipo para actualizar fechas (Lógica de Python)
                $nombreProd = strtolower($item['nombre']);
                if (str_contains($nombreProd, 'gas'))
                    $comproGas = true;
                if (str_contains($nombreProd, 'agua'))
                    $comproAgua = true;
            }

            // 3. Actualizar Cliente
            $cliente = Cliente::find($request->cliente_id);
            if ($comproGas)
                $cliente->fecha_ultima_compra_gas = now();
            if ($comproAgua)
                $cliente->fecha_ultima_compra_agua = now();
            $cliente->save();

            return response()->json(['success' => true, 'venta_id' => $venta->id]);
        });
    }
}