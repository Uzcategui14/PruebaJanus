import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const StockView = () => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/Productos/Stock`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStockData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, []);

    if (loading) return <div>Cargando datos de stock...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Stock de Productos (Vista)</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID Producto</th>
                        <th>Nombre Producto</th>
                        <th>Precio</th>
                        <th>Tipo Producto</th>
                        <th>Cantidad en Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.map((item, index) => (
                        <tr key={index}> {/* Usar un ID único si lo hay, de lo contrario index es aceptable para listas estáticas */}
                            <td>{item.productoId}</td>
                            <td>{item.nombre}</td>
                            <td>{item.precio}</td>
                            <td>{item.tipoProducto}</td>
                            <td>{item.cantidad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockView;