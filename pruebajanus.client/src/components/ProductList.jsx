import React, { useState, useEffect } from 'react';
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

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null); // Producto que se está editando
    const [formData, setFormData] = useState({
        id: 0,
        nombre: '',
        precio: 0,
        idTipoProducto: 0,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/Productos`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/Productos/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert('Producto eliminado exitosamente');
                fetchProducts(); // Refresca la lista
            } catch (error) {
                console.error("Error deleting product:", error);
                alert('Error al eliminar el producto.');
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
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/Productos/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('Producto actualizado exitosamente');
            setEditingProduct(null); // Sale del modo edición
            fetchProducts(); // Refresca la lista
        } catch (error) {
            console.error("Error updating product:", error);
            alert('Error al actualizar el producto.');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Lista de Productos</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Tipo Producto ID</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            {editingProduct === product.id ? (
                                <>
                                    <TableCell><Input type="text" name="nombre" value={formData.nombre} onChange={handleChange} /></TableCell>
                                    <TableCell><Input type="number" name="precio" value={formData.precio} onChange={handleChange} /></TableCell>
                                    <TableCell><Input type="number" name="idTipoProducto" value={formData.idTipoProducto} onChange={handleChange} /></TableCell>
                                    <TableCell>
                                        <Button variant="outline" onClick={handleSubmitEdit}>Guardar</Button>
                                        <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancelar</Button>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{product.nombre}</TableCell>
                                    <TableCell>{product.precio}</TableCell>
                                    <TableCell>{product.idTipoProducto}</TableCell>
                                    <TableCell>
                                            <Button variant="outline" onClick={() => handleEdit(product)}>Editar</Button>
                                            <Button variant="outline" onClick={() => handleDelete(product.id)}>Eliminar</Button>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ProductList;