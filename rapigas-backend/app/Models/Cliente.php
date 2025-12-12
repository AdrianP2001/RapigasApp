<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'clientes';
    public $timestamps = false; // <--- IMPORTANTE
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
