public function index() {
$clientes = Cliente::all();
$alertas = [];
$hoy = now();

foreach ($clientes as $c) {
// Lógica GAS
if ($c->fecha_ultima_compra_gas) {
$ultima = \Carbon\Carbon::parse($c->fecha_ultima_compra_gas);
$freq = $c->frecuencia_consumo ?? 20; // Default 20 como en Python
$proxima = $ultima->copy()->addDays($freq);
$dias = $hoy->diffInDays($proxima, false); // false para permitir negativos

if ($dias <= 2) { $alertas[]=[ 'id'=> $c->id,
    'tipo' => 'GAS',
    'nombre' => $c->nombre,
    'telefono' => $c->telefono,
    'dias' => intval($dias)
    ];
    }
    }

    
    // ... (Repetir lógica similar para AGUA usando frecuencia_agua)


    }

    return response()->json($alertas);
    }