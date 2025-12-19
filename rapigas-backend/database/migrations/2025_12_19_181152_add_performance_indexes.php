<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // Índices compuestos para búsquedas frecuentes
            $table->index(['fecha_venta', 'cliente_id']);
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->index('nombre');
            // 'telefono' ya suele ser unique, lo cual cuenta como índice, pero si no:
            // $table->index('telefono'); 
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex(['fecha_venta', 'cliente_id']);
        });
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropIndex(['nombre']);
        });
    }
};
