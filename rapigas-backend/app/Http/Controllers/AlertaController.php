<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cliente;
use Carbon\Carbon;

class AlertaController extends Controller
{
    // Listar alertas (Ya lo tenías, lo mantengo igual)
    public function index()
    {
        $clientes = Cliente::all();
        $alertas = [];
        $hoy = now();

        foreach ($clientes as $c) {
            // --- GAS ---
            if ($c->fecha_ultima_compra_gas) {
                $ultima = Carbon::parse($c->fecha_ultima_compra_gas);
                $freq = $c->frecuencia_consumo ?? 20;
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

            // --- AGUA ---
            if ($c->fecha_ultima_compra_agua) {
                $ultima = Carbon::parse($c->fecha_ultima_compra_agua);
                $freq = $c->frecuencia_agua ?? 7;
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

    // --- NUEVA FUNCIÓN: RESETEAR ALERTA ---
    public function reset(Request $request, $id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        $tipo = $request->input('tipo'); // 'GAS' o 'AGUA'

        if ($tipo === 'GAS') {
            $cliente->fecha_ultima_compra_gas = now();
        } elseif ($tipo === 'AGUA') {
            $cliente->fecha_ultima_compra_agua = now();
        }

        $cliente->save();

        return response()->json(['message' => 'Alerta reseteada correctamente']);
    }
}
