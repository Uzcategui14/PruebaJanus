import React, { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config';
import { Button } from "@/components/ui/button"; // Necesario para los botones de paginación
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react"; // Iconos para indicar dirección de ordenación

const StockView = () => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Estados para Paginación ---
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0); // Total de elementos recibidos del backend
    // --- Fin Estados Paginación ---

    // --- Estados para Ordenación ---
    const [orderBy, setOrderBy] = useState('ProductoId'); // Columna de ordenación por defecto
    const [orderDirection, setOrderDirection] = useState('asc'); // Dirección de ordenación por defecto
    // --- Fin Estados Ordenación ---

    // `useCallback` para memorizar la función de carga de datos
    const fetchStockData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Incluimos los parámetros de paginación y ordenación en la URL
            const response = await fetch(
                `${API_BASE_URL}/Productos/Stock?pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}`
            );

            if (!response.ok) {
                // Intenta parsear el cuerpo del error si la respuesta no es OK
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.title || errorData.detail || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            // Lectura de encabezados para paginación
            const totalCountHeader = response.headers.get('X-Total-Count');
            if (totalCountHeader) {
                setTotalItems(parseInt(totalCountHeader, 10));
            } else {
                console.warn("Encabezado 'X-Total-Count' no encontrado en la respuesta del backend.");
                setTotalItems(0); // Asigna 0 si el encabezado no está presente
            }

            const data = await response.json();
            setStockData(data);
        } catch (err) {
            console.error("Error fetching stock data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, pageSize, orderBy, orderDirection]); // Dependencias: la función se recrea si estos estados cambian

    // useEffect para llamar a fetchStockData cuando cambien los parámetros de paginación/ordenación
    useEffect(() => {
        fetchStockData();
    }, [fetchStockData]); // Depende de fetchStockData (que ya usa useCallback)

    // --- Lógica de Paginación ---
    // Calcula el número total de páginas. Maneja el caso de totalItems = 0 para evitar Infinity.
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

    const handlePreviousPage = () => {
        setPageNumber(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setPageNumber(prev => Math.min(totalPages, prev + 1));
    };
    // --- Fin Lógica Paginación ---

    // --- Lógica de Ordenación ---
    const handleSort = (column) => {
        // Si la columna es la misma, cambia la dirección
        // Si es una columna diferente, establece 'asc' como dirección inicial
        if (orderBy === column) {
            setOrderDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setOrderBy(column);
            setOrderDirection('asc'); // Siempre comienza con ascendente al cambiar de columna
        }
        // Al cambiar la ordenación, es buena práctica resetear a la primera página
        setPageNumber(1);
    };

    // Función auxiliar para renderizar iconos de ordenación
    const renderSortIcon = (columnName) => {
        if (orderBy === columnName) {
            return orderDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4 inline-block" /> : <ChevronDown className="ml-1 h-4 w-4 inline-block" />;
        }
        return null; // No muestra icono si no es la columna activa
    };
    // --- Fin Lógica Ordenación ---

    if (loading) {
        return (
            <Card className="shadow-lg p-6 text-center max-w-5xl mx-auto my-8">
                <p>Cargando datos de stock...</p>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="shadow-lg p-6 text-center bg-red-50 border-red-200 max-w-5xl mx-auto my-8">
                <p className="text-red-600 font-medium">Error al cargar datos de stock: {error}</p>
                <Button onClick={fetchStockData} className="mt-4" variant="outline">Reintentar</Button>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Vista Stock Productos</CardTitle>
                <CardDescription>Lista detallada de productos y su estado de stock</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableCaption>
                            {stockData.length === 0 && !loading ? "No hay datos de stock disponibles." : ""}
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                {/* Headers clickeables para ordenar */}
                                <TableHead className="pl-8 cursor-pointer" onClick={() => handleSort('ProductoId')}>
                                    ID Producto {renderSortIcon('ProductoId')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('Nombre')}>
                                    Nombre Producto {renderSortIcon('Nombre')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('Precio')}>
                                    Precio {renderSortIcon('Precio')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('TipoProducto')}>
                                    Tipo Producto {renderSortIcon('TipoProducto')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('Cantidad')}>
                                    Cantidad en Stock {renderSortIcon('Cantidad')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stockData.map((item, index) => (
                                <TableRow key={item.productoId || index}> {/* Usa productoId como key si es único, de lo contrario index es un fallback */}
                                    <TableCell className="pl-8">{item.productoId}</TableCell>
                                    <TableCell className="font-medium">{item.nombre}</TableCell>
                                    {/* Usamos el operador de encadenamiento opcional (?) y nullish coalescing (??)
                                        para manejar valores potencialmente nulos o indefinidos */}
                                    <TableCell>${item.precio?.toFixed(2) ?? '0.00'}</TableCell>
                                    <TableCell>{item.tipoProducto ?? 'N/A'}</TableCell>
                                    <TableCell>{item.cantidad ?? '0'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* --- Controles de Paginación --- */}
            {totalPages > 1 && ( // Solo muestra los controles si hay más de una página
                <div className="flex justify-between items-center px-6 py-4 border-t">
                    <Button
                        onClick={handlePreviousPage}
                        disabled={pageNumber === 1 || loading} // Deshabilita si es la primera página o si está cargando
                        variant="outline"
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-gray-700">
                        Página {pageNumber} de {totalPages} ({totalItems} elementos en total)
                    </span>
                    <Button
                        onClick={handleNextPage}
                        disabled={pageNumber === totalPages || loading} // Deshabilita si es la última página o si está cargando
                        variant="outline"
                    >
                        Siguiente
                    </Button>
                </div>
            )}
            {/* --- Fin Controles de Paginación --- */}
        </Card>
    );
};

export default StockView;