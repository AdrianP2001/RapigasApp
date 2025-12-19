<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Índices para VENTAS (Búsqueda por fecha y cliente)
        Schema::table('ventas', function (Blueprint $table) {
            $table->index('fecha_venta');
            $table->index('cliente_id');
            // Índice compuesto para el dashboard (muy rápido para sumar totales por fecha)
            $table->index(['fecha_venta', 'total']);
        });

        // 2. Índices para DETALLES (Para unir tablas rápido)
        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->index('venta_id');
            $table->index('producto_id');
        });

        // 3. Índices para CLIENTES (Para el buscador en tiempo real)
        Schema::table('clientes', function (Blueprint $table) {
            $table->index('nombre');
            $table->index('telefono');
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex(['fecha_venta']);
            $table->dropIndex(['cliente_id']);
            $table->dropIndex(['fecha_venta', 'total']);
        });

        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->dropIndex(['venta_id']);
            $table->dropIndex(['producto_id']);
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->dropIndex(['nombre']);
            $table->dropIndex(['telefono']);
        });
    }
};
