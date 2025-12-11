// app/Models/Venta.php
class Venta extends Model {
protected $table = 'ventas';
public $timestamps = false;
protected $fillable = ['cliente_id', 'total', 'metodo_pago', 'fecha_venta'];

// Relación con el detalle
public function detalles() {
return $this->hasMany(DetalleVenta::class, 'venta_id');
}

// Relación con cliente
public function cliente() {
return $this->belongsTo(Cliente::class, 'cliente_id');
}
}

// app/Models/DetalleVenta.php
class DetalleVenta extends Model {
protected $table = 'detalle_ventas';
public $timestamps = false;
protected $fillable = ['venta_id', 'producto_id', 'cantidad', 'precio_unitario'];

public function producto() {
return $this->belongsTo(Producto::class, 'producto_id');
}
}