import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const ProductForm = ({ onProductAdded }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [idTipoProducto, setIdTipoProducto] = useState('');
    const [errors, setErrors] = useState({}); // Nuevo estado para los errores de validación
    const [generalError, setGeneralError] = useState(''); // Estado para errores no específicos de un campo

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Limpiar errores previos
        setGeneralError('');

        // Validaciones básicas en frontend antes de enviar (opcional pero recomendado)
        if (!nombre || nombre.length > 100) {
            setErrors(prev => ({ ...prev, Nombre: ["El nombre es obligatorio y no puede exceder los 100 caracteres."] }));
            return;
        }
        if (parseFloat(precio) <= 0 || isNaN(parseFloat(precio))) {
            setErrors(prev => ({ ...prev, Precio: ["El precio debe ser un número positivo."] }));
            return;
        }
        if (parseInt(idTipoProducto) <= 0 || isNaN(parseInt(idTipoProducto))) {
            setErrors(prev => ({ ...prev, IdTipoProducto: ["El ID del tipo de producto debe ser un número positivo."] }));
            return;
        }

        const newProduct = {
            nombre,
            precio: parseFloat(precio),
            idTipoProducto: parseInt(idTipoProducto),
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
                // Si la respuesta no es OK, intentamos leer el JSON de error
                const errorData = await response.json();

                // Verifica si hay errores de validación específicos del modelo (el objeto 'errors')
                if (response.status === 400 && errorData.errors) {
                    const backendErrors = {};
                    for (const key in errorData.errors) {
                        // El backend devuelve errores para "Nombre", "Precio", etc.
                        // Y también puede devolver errores para el modelo completo ("$") o "producto" si el JSON está malformado.
                        // Usamos key.charAt(0).toUpperCase() + key.slice(1) para normalizar la primera letra a mayúscula
                        // ya que C# usa PascalCase para las propiedades.
                        const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                        backendErrors[fieldName] = errorData.errors[key];
                    }
                    setErrors(backendErrors);
                    setGeneralError(errorData.title || 'Se encontraron errores de validación.');
                } else {
                    // Para otros errores (500 Internal Server Error, 404 Not Found, etc.)
                    const message = errorData.title || errorData.detail || 'Error desconocido al añadir el producto.';
                    setGeneralError(message);
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
            setGeneralError(`Error de red o comunicación: ${error.message}`);
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Añadir Productos</CardTitle>
                <CardDescription>Añade información para agregar productos</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="nombre" className="text-sm font-medium">
                            Nombre del Producto *:
                        </Label>
                        <Input
                            type="text"
                            id="nombre" // Es importante que el id coincida con el htmlFor de Label
                            placeholder="Nombre del producto"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={errors.Nombre ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.Nombre && <p className="text-red-500 text-sm">{errors.Nombre.join(', ')}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="precio" className="text-sm font-medium">
                                Precio del Producto *
                            </Label>
                            <Input
                                type="number"
                                id="precio"
                                placeholder="0.00"
                                step="0.01"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                className={errors.Precio ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.Precio && <p className="text-red-500 text-sm">{errors.Precio.join(', ')}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="idTipoProducto" className="text-sm font-medium">
                                ID del Tipo de Producto *
                            </Label>
                            <Input
                                type="number"
                                id="idTipoProducto"
                                placeholder="Ej. 1"
                                value={idTipoProducto}
                                onChange={(e) => setIdTipoProducto(e.target.value)}
                                className={errors.IdTipoProducto ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.IdTipoProducto && <p className="text-red-500 text-sm">{errors.IdTipoProducto.join(', ')}</p>}
                        </div>
                    </div>
                    <Button type="submit" variant="outline" size="sm" className="justify-center">
                         Añadir Producto
                    </Button>
                    {/* Muestra un error general si existe (no asociado a un campo específico) */}
                    {generalError && (
                        <div className="text-red-600 font-medium text-center mt-4 p-2 bg-red-50 rounded">
                            {generalError}
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default ProductForm;