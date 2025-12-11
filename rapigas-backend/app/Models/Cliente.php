<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'clientes'; // Tu tabla en Supabase
    public $timestamps = false; // Python manejaba las fechas manualmente

    protected $fillable = [
        'nombre',
        'telefono',
        'direccion',
        'categoria',
        'frecuencia_consumo',
        'frecuencia_agua',
        'fecha_ultima_compra_gas',
        'fecha_ultima_compra_agua',
        'fecha_modificacion'
    ];
}