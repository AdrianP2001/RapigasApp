<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos'; // Tu tabla en Supabase
    public $timestamps = false;     // Python no usaba created_at/updated_at

    protected $fillable = [
        'nombre',
        'precio',
        'activo',         // Boolean
        'es_recurrente',  // Boolean (para saber si afecta a alertas)
        'imagen_url'      // Si tienes imágenes
    ];
}
