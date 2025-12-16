<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\AlertaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ClienteController; // <--- ¡Importante!

// --- Rutas Públicas ---
Route::post('/login', [AuthController::class, 'login']);

// --- Rutas Protegidas ---
Route::middleware('auth:sanctum')->group(function () {

    // 1. Productos (Esta ya te funciona)
    Route::get('/productos', [ProductoController::class, 'index']);

    // 2. Clientes (¡ESTAS SON LAS QUE FALTAN!)
    Route::get('/clientes', [ClienteController::class, 'index']);       // Para la lista general
    Route::get('/clientes/buscar', [ClienteController::class, 'search']); // Para el buscador
    Route::post('/clientes', [ClienteController::class, 'store']);      // Crear/Editar
    Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']); // Eliminar

    // 3. Ventas y Dashboard
    Route::post('/ventas', [VentaController::class, 'store']);
    Route::get('/ventas', [VentaController::class, 'index']); // Historial
    Route::delete('/ventas/{id}', [VentaController::class, 'destroy']); // Anular
    Route::get('/dashboard', [VentaController::class, 'resumen']);

    // 4. Alertas
    Route::get('/alertas', [AlertaController::class, 'index']);
    Route::post('/alertas/{id}/reset', [AlertaController::class, 'reset']);
});
