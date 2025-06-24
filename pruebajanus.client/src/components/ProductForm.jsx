import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"

const ProductForm = ({ onProductAdded }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [idTipoProducto, setIdTipoProducto] = useState('');
    const [setErrors] = useState({}); // Nuevo estado para los errores de validaci�n

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Limpiar errores previos
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

                if (response.status === 400) {
                    const errorData = await response.json();
                    if (errorData.errors) {
                        setErrors(errorData.errors); // Guardar los errores del backend
                    } else {
                        alert('Error de validación desconocido.');
                    }
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                // Si la respuesta es OK (ej. 200 OK, 201 Created)
                alert('Producto añadido exitosamente');
                setNombre('');
                setPrecio('');
                setIdTipoProducto('');
                if (onProductAdded) onProductAdded();
            }

        } catch (error) {
            console.error("Error adding product:", error);
            alert(`Error al añadir el producto: ${error.message}`);
        }
    };
    return (
        <div className="p-6 bg-white rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Añadir Nuevo Producto</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-1.5">
                    <Label>
                        Nombre:
                        <Input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </Label>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label>
                        Precio:
                        <Input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                    </Label>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label>
                        ID Tipo Producto:
                        <Input type="number" value={idTipoProducto} onChange={(e) => setIdTipoProducto(e.target.value)} required />
                    </Label>
                </div>
                <Button type="submit" variant="outline">
                     Añadir Producto
                </Button>
            </form>
        </div>
    );
};

export default ProductForm;