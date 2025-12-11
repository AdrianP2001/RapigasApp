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
}