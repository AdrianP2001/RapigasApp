use App\Models\Usuario; // Crea este modelo apuntando a la tabla 'usuarios'
use Illuminate\Support\Facades\Hash;

public function login(Request $request) {
$user = Usuario::where('usuario', $request->usuario)->first();

// Verificamos password igual que en tu script Python: bcrypt.checkpw
if (!$user || !Hash::check($request->password, $user->password)) {
return response()->json(['message' => 'Credenciales inválidas'], 401);
}

// En Laravel API, solemos retornar un Token (Sanctum)
$token = $user->createToken('api-token')->plainTextToken;

return response()->json(['token' => $token, 'user' => $user]);

$user = Usuario::where('usuario', $request->usuario)->first();

if (!$user) {
return response()->json(['message' => 'Usuario no encontrado'], 401);
}

// TRUCO: Reemplazar $2b$ (Python) por $2y$ (PHP) temporalmente para verificar
$hashPython = $user->password;
$hashPHP = str_replace('$2b$', '$2y$', $hashPython);

if (!Hash::check($request->password, $hashPHP)) {
return response()->json(['message' => 'Contraseña incorrecta'], 401);
}
}