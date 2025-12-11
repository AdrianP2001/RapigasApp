<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;

// --- Rutas Públicas (Sin Token) ---
Route::post('/login', [AuthController::class, 'login']);

// --- Rutas Protegidas (Requieren Token de Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    // GET /api/productos
    Route::get('/productos', [ProductoController::class, 'index']);

    // Aquí irían todas las demás: /clientes, /ventas, /alertas...
});
