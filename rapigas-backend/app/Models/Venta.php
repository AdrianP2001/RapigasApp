class Venta extends Model
{
protected $table = 'ventas';
public $timestamps = false; // <--- IMPORTANTE
    protected $fillable=['cliente_id', 'total' , 'metodo_pago' , 'fecha_venta' ];

    // Relaciones
    public function cliente() { return $this->belongsTo(Cliente::class, 'cliente_id'); }
    public function detalles() { return $this->hasMany(DetalleVenta::class, 'venta_id'); }
    }