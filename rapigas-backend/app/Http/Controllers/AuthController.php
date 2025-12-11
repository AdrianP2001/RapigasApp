<?php

namespace App\Http\Controllers;

use App\Models\Usuario; // Crea un modelo simple para la tabla 'usuarios'
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Equivalente a la funcion database.validar_login(usuario, password_plana)
     * POST /api/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string',
            'password' => 'required|string',
        ]);

        // 1. Buscar el usuario
        $user = Usuario::where('usuario', $request->usuario)->first();

        // 2. Verificar usuario y contraseña (similar a bcrypt.checkpw)
        // Si el hash en la DB fue generado por bcrypt, Hash::check funcionará.
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => '❌ Usuario o contraseña incorrectos', // Mensaje de error de mod_login.py
            ], 401);
        }

        // 3. Generar token API (usando Laravel Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => '✅ Acceso Correcto', // Mensaje de éxito de mod_login.py
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}