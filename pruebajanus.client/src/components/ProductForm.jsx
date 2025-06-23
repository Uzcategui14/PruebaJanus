import React, { useState } from 'react';
import API_BASE_URL from '../config';

const ProductForm = ({ onProductAdded }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [idTipoProducto, setIdTipoProducto] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newProduct = {
            nombre,
            precio: parseFloat(precio), // Aseg�rate de que el precio sea un n�mero
            idTipoProducto: parseInt(idTipoProducto), // Aseg�rate de que el ID sea un entero
        };

        try {
            const response = await fetch(`${API_BASE_URL}/Productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                // Si usas el m�todo con SP, podr�a no devolver un JSON al principio
                if (response.status === 201) { // 201 Created es un buen indicativo
                    alert('Producto a�adido exitosamente (usando SP o EF)');
                    setNombre('');
                    setPrecio('');
                    setIdTipoProducto('');
                    if (onProductAdded) onProductAdded(); // Notifica al componente padre para refrescar la lista
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const addedProduct = await response.json(); // Si el backend devuelve el objeto creado
            alert('Producto a�adido exitosamente');
            setNombre('');
            setPrecio('');
            setIdTipoProducto('');
            if (onProductAdded) onProductAdded(); // Notifica al componente padre para refrescar la lista

        } catch (error) {
            console.error("Error adding product:", error);
            alert('Error al a�adir el producto.');
        }
    };

    return (
        <div>
            <h2>A�adir Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Nombre:
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        Precio:
                        <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        ID Tipo Producto:
                        <input type="number" value={idTipoProducto} onChange={(e) => setIdTipoProducto(e.target.value)} required />
                    </label>
                </div>
                <button type="submit">A�adir Producto</button>
            </form>
        </div>
    );
};

export default ProductForm;