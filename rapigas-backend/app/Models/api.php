<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VentaController;   // <--- Importante
use App\Http\Controllers\AlertaController;  // <--- Importante
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ClienteController; // <--- Importante

// --- Rutas Públicas ---
Route::post('/login', [AuthController::class, 'login']);

// --- Rutas Protegidas (Solo con Token) ---
Route::middleware('auth:sanctum')->group(function () {

    // 1. Dashboard y Alertas
    Route::get('/dashboard', [VentaController::class, 'resumen']); // <--- La función nueva
    Route::get('/alertas', [AlertaController::class, 'index']);

    // 2. Operaciones de Venta
    Route::post('/ventas', [VentaController::class, 'store']);

    // 3. Otros mantenimientos
    Route::get('/productos', [ProductoController::class, 'index']);

    Route::middleware('auth:sanctum')->group(function () {
        // ... tus otras rutas (Dashboard, Alertas, Ventas) ...

        // --- Clientes ---
        Route::get('/clientes/buscar', [ClienteController::class, 'search']); // <--- NUEVA

        // --- Productos ---
        Route::get('/productos', [ProductoController::class, 'index']);

        Route::get('/dashboard', [VentaController::class, 'resumen']);
        Route::get('/alertas', [AlertaController::class, 'index']);
        Route::post('/ventas', [VentaController::class, 'store']);
        Route::get('/productos', [ProductoController::class, 'index']);

        // --- NUEVA RUTA ---
        Route::get('/clientes/buscar', [ClienteController::class, 'search']);
        Route::get('/alertas', [AlertaController::class, 'index']);
        Route::post('/alertas/{id}/reset', [AlertaController::class, 'reset']); // <--- NUEVA
        // ...
        // --- CLIENTES ---
        Route::get('/clientes', [ClienteController::class, 'index']);       // Listar
        Route::get('/clientes/buscar', [ClienteController::class, 'search']); // Buscar
        Route::post('/clientes', [ClienteController::class, 'store']);      // Guardar/Editar
        Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']); // Eliminar
    });
});
