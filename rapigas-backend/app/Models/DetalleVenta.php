
// app/Models/DetalleVenta.php
class DetalleVenta extends Model
{
    protected $table = 'detalle_ventas';
    public $timestamps = false;
    protected $fillable = ['venta_id', 'producto_id', 'cantidad', 'precio_unitario'];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}