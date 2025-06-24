import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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
        <div className="p-6 bg-white rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Stock de Productos (Vista)</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID Producto</TableHead>
                        <TableHead>Nombre Producto</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Tipo Producto</TableHead>
                        <TableHead>Cantidad en Stock</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockData.map((item, index) => (
                        <TableRow key={index}> {/* Usar un ID único si lo hay, de lo contrario index es aceptable para listas estáticas */}
                            <TableCell>{item.productoId}</TableCell>
                            <TableCell>{item.nombre}</TableCell>
                            <TableCell>{item.precio}</TableCell>
                            <TableCell>{item.tipoProducto}</TableCell>
                            <TableCell>{item.cantidad}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default StockView;