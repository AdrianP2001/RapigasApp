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

    // Dashboard & Alertas
    Route::get('/dashboard', [VentaController::class, 'resumen']);
    Route::get('/alertas', [AlertaController::class, 'index']);
    Route::post('/alertas/{id}/reset', [AlertaController::class, 'reset']);

    // Ventas
    Route::post('/ventas', [VentaController::class, 'store']);
    Route::get('/productos', [ProductoController::class, 'index']);

    // Clientes (Las que faltaban)
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::get('/clientes/buscar', [ClienteController::class, 'search']);
    Route::post('/clientes', [ClienteController::class, 'store']);
    Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']);

    // Historial
    Route::get('/ventas', [VentaController::class, 'index']); // Listar/Filtrar
    Route::delete('/ventas/{id}', [VentaController::class, 'destroy']); // Anular
});
