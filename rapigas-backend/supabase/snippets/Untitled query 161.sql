-- 1. Arreglar contador de Ventas
SELECT setval('ventas_id_seq', (SELECT MAX(id) FROM ventas));

-- 2. Arreglar contador de Detalle Ventas (Aquí saltó tu error)
SELECT setval('detalle_ventas_id_seq', (SELECT MAX(id) FROM detalle_ventas));

-- 3. Arreglar contador de Clientes
SELECT setval('clientes_id_seq', (SELECT MAX(id) FROM clientes));

-- 4. Arreglar contador de Productos
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));