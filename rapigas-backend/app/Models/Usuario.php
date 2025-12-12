<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Importante para el token

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios'; // Tu tabla en Supabase (Python usaba 'usuarios')
    public $timestamps = false;    // Si tu tabla no tiene created_at/updated_at

    protected $fillable = [
        'usuario',
        'password',
        // agrega otros campos si tienes (email, rol, etc.)
    ];

    // Ocultar password para que no se devuelva en el JSON
    protected $hidden = [
        'password',
    ];
}