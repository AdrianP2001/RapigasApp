use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\AlertaController;

// Login público
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren Token si usas Sanctum)
Route::middleware('auth:sanctum')->group(function () {

// Clientes
Route::get('/clientes', [ClienteController::class, 'index']); // obtener_clientes
Route::post('/clientes', [ClienteController::class, 'store']); // guardar_cliente
Route::get('/clientes/buscar', [ClienteController::class, 'search']); // buscar_clientes

// Ventas
Route::post('/ventas', [VentaController::class, 'store']); // registrar_venta_completa
Route::get('/ventas/historial', [VentaController::class, 'history']); // obtener_historial_ventas

// Dashboard & Alertas
Route::get('/alertas', [AlertaController::class, 'index']); // obtener_alertas
Route::get('/dashboard/resumen', [VentaController::class, 'dailySummary']); // obtener_total_ventas_hoy
});