<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validar que envíen datos
        $request->validate([
            'usuario' => ['required', 'string'],
            'password' => ['required', 'string']
        ]);

        if (!filter_var($request->usuario, FILTER_VALIDATE_EMAIL)) {
            throw ValidationException::withMessages(['usuario' => 'El usuario debe ser un correo electrónico válido.']);
        }

        // 2. Buscar el usuario
        $user = Usuario::where('usuario', $request->usuario)->first();

        // 3. Verificar contraseña
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        // 4. Crear el token
        $token = $user->createToken('api-token')->plainTextToken;

        // 5. Responder
        return response()->json([
            'message' => 'Login exitoso',
            'token' => $token,
            'user' => $user
        ]);
    }
}
