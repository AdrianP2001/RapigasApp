<?php

namespace App\Http\Controllers; // Namespace correcto

use Illuminate\Http\Request;
use App\Models\Cliente; // Importar el modelo Cliente
use Carbon\Carbon;      // Importar Carbon para las fechas

class AlertaController extends Controller
{
    public function index()
    {
        $clientes = Cliente::all();
        $alertas = [];
        $hoy = now();

        foreach ($clientes as $c) {
            // --- Lógica GAS ---
            if ($c->fecha_ultima_compra_gas) {
                $ultima = Carbon::parse($c->fecha_ultima_compra_gas);
                $freq = $c->frecuencia_consumo ?? 20; // Default 20
                $proxima = $ultima->copy()->addDays($freq);
                $dias = $hoy->diffInDays($proxima, false);

                if ($dias <= 2) {
                    $alertas[] = [
                        'id' => $c->id,
                        'tipo' => 'GAS',
                        'nombre' => $c->nombre,
                        'telefono' => $c->telefono,
                        'dias' => intval($dias)
                    ];
                }
            }

            // --- Lógica AGUA (Nueva) ---
            if ($c->fecha_ultima_compra_agua) {
                $ultima = Carbon::parse($c->fecha_ultima_compra_agua);
                $freq = $c->frecuencia_agua ?? 7; // Default 7
                $proxima = $ultima->copy()->addDays($freq);
                $dias = $hoy->diffInDays($proxima, false);

                if ($dias <= 2) {
                    $alertas[] = [
                        'id' => $c->id,
                        'tipo' => 'AGUA',
                        'nombre' => $c->nombre,
                        'telefono' => $c->telefono,
                        'dias' => intval($dias)
                    ];
                }
            }
        }

        return response()->json($alertas);
    }
}