import React from 'react';
import './index.css';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import StockView from './components/StockView';
import { Button } from '@/components/ui/button';


function App() {
    // Para refrescar la lista de productos despu�s de a�adir uno nuevo
    const handleProductAdded = () => {
        // Podr�as llamar directamente a fetchProducts en ProductList
        // O podr�as tener un estado compartido que ProductList escuche
        // Para simplificar, le damos una prop de recarga
        window.location.reload(); // Simple pero no ideal para apps grandes
        // Una mejor forma ser�a tener un estado en App.js que ProductList escuche
    };

    return (
        <div className="App p-8 bg-gray-50"> {/* A�ade algunas clases de Tailwind aqu� */}
            <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">Gestión de Productos Full Stack</h1>
                <ProductForm onProductAdded={handleProductAdded} />
                <ProductList />
                <StockView />
        </div>
    );
}

export default App;