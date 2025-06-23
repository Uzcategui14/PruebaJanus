import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

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
        <div>
            <h2>Lista de Productos</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Tipo Producto ID</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            {editingProduct === product.id ? (
                                <>
                                    <td><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} /></td>
                                    <td><input type="number" name="precio" value={formData.precio} onChange={handleChange} /></td>
                                    <td><input type="number" name="idTipoProducto" value={formData.idTipoProducto} onChange={handleChange} /></td>
                                    <td>
                                        <button onClick={handleSubmitEdit}>Guardar</button>
                                        <button onClick={() => setEditingProduct(null)}>Cancelar</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{product.nombre}</td>
                                    <td>{product.precio}</td>
                                    <td>{product.idTipoProducto}</td>
                                    <td>
                                        <button onClick={() => handleEdit(product)}>Editar</button>
                                        <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;