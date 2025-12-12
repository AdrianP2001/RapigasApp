<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';
    public $timestamps = false; // <--- IMPORTANTE: Python no usaba esto
    protected $fillable = ['nombre', 'precio', 'activo', 'es_recurrente'];
}
