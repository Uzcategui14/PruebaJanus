import React, { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { ChevronUp, ChevronDown } from "lucide-react";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null); // Producto que se está editando
    const [formData, setFormData] = useState({
        id: 0,
        nombre: '',
        precio: 0,
        idTipoProducto: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Estados para Paginación ---
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    // --- Fin Estados Paginación ---

    // --- Estados para Ordenación ---
    const [orderBy, setOrderBy] = useState('Id'); // Columna de ordenación por defecto
    const [orderDirection, setOrderDirection] = useState('asc'); // Dirección de ordenación por defecto
    // --- Fin Estados Ordenación ---

    // --- Nuevo estado para errores de validación ---
    const [validationErrors, setValidationErrors] = useState({});
    // --- Fin Nuevo estado ---

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${API_BASE_URL}/Productos?pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}`
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.title || errorData.detail || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            // Lectura de encabezados para paginación
            const totalCountHeader = response.headers.get('X-Total-Count');
            if (totalCountHeader) {
                setTotalItems(parseInt(totalCountHeader, 10));
            } else {
                setTotalItems(0); // Default if header not present
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, pageSize,  orderBy, orderDirection]); // Añadida paginación

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- Lógica de Paginación ---
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
    const renderSortIcon = (columnName) => {
        if (orderBy === columnName) {
            return orderDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4 inline-block" /> : <ChevronDown className="ml-1 h-4 w-4 inline-block" />;
        }
        return null; // No muestra icono si no es la columna activa
    };
    // --- Fin Lógica Ordenación ---

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/Productos/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.title || errorData.detail || `HTTP error! status: ${response.status}`;
                    throw new Error(errorMessage);
                }
                alert('Producto eliminado exitosamente');
                // Ajustar la paginación después de eliminar, si es el último item de la página
                const remainingItems = totalItems - 1;
                const newTotalPages = Math.ceil(remainingItems / pageSize);
                if (pageNumber > newTotalPages && newTotalPages > 0) {
                    setPageNumber(newTotalPages);
                } else {
                    fetchProducts();
                }
            } catch (err) {
                console.error("Error deleting product:", err);
                alert(`Error al eliminar el producto: ${err.message}`);
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product.id);
        setFormData({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            idTipoProducto: product.idTipoProducto,
        });
        setValidationErrors({}); // Limpia errores previos al iniciar la edición
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
        // Limpia el error de validación para el campo actual al escribir
        setValidationErrors(prev => ({
            ...prev,
            [name]: undefined // Elimina el mensaje de error para este campo
        }));
    };

    // --- Función de validación ---
    const validateForm = () => {
        const errors = {};
        if (!formData.nombre.trim()) {
            errors.nombre = 'El nombre no puede estar vacío.';
        } else if (formData.nombre.trim().length < 3) {
            errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
        }

        if (formData.precio <= 0) {
            errors.precio = 'El precio debe ser mayor que cero.';
        } else if (isNaN(formData.precio)) { // Validar si es un número
            errors.precio = 'El precio debe ser un número.';
        }

        if (formData.idTipoProducto <= 0) {
            errors.idTipoProducto = 'El ID de Tipo de Producto debe ser mayor que cero.';
        } else if (isNaN(formData.idTipoProducto)) { // Validar si es un número
            errors.idTipoProducto = 'El ID de Tipo de Producto debe ser un número.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0; // Retorna true si no hay errores
    };
    // --- Fin Función de validación ---

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        // --- Ejecutar validación antes de enviar ---
        if (!validateForm()) {
            alert('Por favor, corrige los errores en el formulario.');
            return; // Detiene el envío si hay errores
        }
        // --- Fin Ejecutar validación ---

        try {
            const response = await fetch(`${API_BASE_URL}/Productos/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                // Intenta leer errores específicos del backend (ej. validaciones de modelo en .NET)
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 400 && errorData.errors) {
                    // Si el backend devuelve errores de validación de modelo
                    const backendErrors = {};
                    for (const key in errorData.errors) {
                        // Aquí mapeas los nombres de campo del backend a los del frontend si difieren
                        // Por ejemplo, "Nombre" del backend podría ser "nombre" en el frontend
                        const frontendKey = key.charAt(0).toLowerCase() + key.slice(1);
                        backendErrors[frontendKey] = errorData.errors[key].join(', ');
                    }
                    setValidationErrors(backendErrors);
                    alert('Error de validación del servidor. Por favor, revisa los campos.');
                } else {
                    const errorMessage = errorData.title || errorData.detail || `HTTP error! status: ${response.status}`;
                    throw new Error(errorMessage);
                }
                return; // Sale de la función si hubo errores del servidor
            }
            alert('Producto actualizado exitosamente');
            setEditingProduct(null); // Sale del modo edición
            setValidationErrors({}); // Limpia los errores después de un envío exitoso
            fetchProducts(); // Refresca la lista
        } catch (err) {
            console.error("Error updating product:", err);
            // Solo muestra el alert si el error no fue un 400 ya manejado
            if (!err.message.includes("400")) {
                alert(`Error al actualizar el producto: ${err.message}`);
            }
        }
    };

    if (loading) {
        return (
            <Card className="shadow-lg p-6 text-center max-w-5xl mx-auto my-8">
                <p>Cargando productos...</p>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="shadow-lg p-6 text-center bg-red-50 border-red-200 max-w-4xl mx-auto my-8">
                <p className="text-red-600 font-medium">Error al cargar productos: {error}</p>
                <Button onClick={fetchProducts} className="mt-4" variant="outline">Reintentar</Button>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Lista de Productos</CardTitle>
                <CardDescription>Lista de productos con sus atributos</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableCaption>
                            {products.length === 0 && !loading ? "No hay productos disponibles." : ""}
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-8 cursor-pointer" onClick={() => handleSort('Id')}>
                                    ID {renderSortIcon('Id')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('Nombre')}>
                                    Nombre {renderSortIcon('Nombre')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('Precio')}>
                                    Precio {renderSortIcon('Precio')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('IdTipoProducto')}>
                                    ID Tipo Producto {renderSortIcon('IdTipoProducto')}
                                </TableHead>
                                <TableHead className="text-right pr-24">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="pl-8">{product.id}</TableCell>
                                    {editingProduct === product.id ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    type="text"
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                    // Añadir estilo de error si hay un error para 'nombre'
                                                    className={validationErrors.nombre ? 'border-red-500' : ''}
                                                />
                                                {/* Mostrar mensaje de error */}
                                                {validationErrors.nombre && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.nombre}</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    name="precio"
                                                    value={formData.precio}
                                                    onChange={handleChange}
                                                    // Añadir estilo de error si hay un error para 'precio'
                                                    className={validationErrors.precio ? 'border-red-500' : ''}
                                                />
                                                {/* Mostrar mensaje de error */}
                                                {validationErrors.precio && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.precio}</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    name="idTipoProducto"
                                                    value={formData.idTipoProducto}
                                                    onChange={handleChange}
                                                    // Añadir estilo de error si hay un error para 'idTipoProducto'
                                                    className={validationErrors.idTipoProducto ? 'border-red-500' : ''}
                                                />
                                                {/* Mostrar mensaje de error */}
                                                {validationErrors.idTipoProducto && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.idTipoProducto}</p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={handleSubmitEdit}>Guardar</Button>
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        setEditingProduct(null); // Sale del modo edición
                                                        setValidationErrors({}); // Limpia los errores al cancelar
                                                    }}>Cancelar</Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{product.nombre}</TableCell>
                                            <TableCell>${product.precio?.toFixed(2) ?? '0.00'}</TableCell>
                                            <TableCell>{product.idTipoProducto}</TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>Editar</Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>Eliminar</Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* --- Controles de Paginación --- */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t">
                    <Button
                        onClick={handlePreviousPage}
                        disabled={pageNumber === 1 || loading}
                        variant="outline"
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-gray-700">
                        Página {pageNumber} de {totalPages} ({totalItems} elementos en total)
                    </span>
                    <Button
                        onClick={handleNextPage}
                        disabled={pageNumber === totalPages || loading}
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

export default ProductList;