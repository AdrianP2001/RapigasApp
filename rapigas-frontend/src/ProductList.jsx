import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Se recomienda usar Axios o fetch

const ProductList = () => {
    // El estado para guardar la lista de productos
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // La URL de tu API de Laravel
        const API_URL = 'http://localhost:8000/api/productos';

        const fetchProductos = async () => {
            try {
                // Se asume que el usuario ya está logueado y tenemos el token 
                // para las rutas protegidas.
                const token = localStorage.getItem('authToken');

                const response = await axios.get(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Guardar los datos en el estado
                setProductos(response.data);

            } catch (err) {
                console.error("Error al obtener productos:", err);
                setError("Error al cargar los productos. Intente de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []); // El array vacío asegura que se ejecute una sola vez al cargar

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-list-container">
            <h3>Productos Activos</h3>
            {/* Renderizar el equivalente de la tabla o lista de productos */}
            <ul>
                {productos.map(p => (
                    <li key={p.id}>
                        {p.nombre}: ${p.precio}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;