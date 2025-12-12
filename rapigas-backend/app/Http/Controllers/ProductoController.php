<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    public function index()
    {
        // Solo productos activos, ordenados por ID como en Python
        return Producto::where('activo', true)
            ->orderBy('id', 'asc')
            ->get();
    }
}
