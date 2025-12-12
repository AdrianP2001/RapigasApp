<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    // Obtener todos los productos activos
    public function index()
    {
        // Traemos todos los productos ordenados por nombre
        // Puedes agregar ->where('activo', true) si tienes esa columna
        $productos = Producto::orderBy('nombre', 'asc')->get();

        return response()->json($productos);
    }
}
