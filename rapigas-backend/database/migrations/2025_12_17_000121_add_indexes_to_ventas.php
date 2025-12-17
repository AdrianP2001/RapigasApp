<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // Creamos índices para acelerar las búsquedas
            $table->index('fecha_venta'); // Acelera el filtro "Desde - Hasta"
            $table->index('cliente_id');  // Acelera la búsqueda por cliente
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex(['fecha_venta']);
            $table->dropIndex(['cliente_id']);
        });
    }
};
