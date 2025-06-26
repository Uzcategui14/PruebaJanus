import React from 'react';
import './index.css';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import StockView from './components/StockView';
import { Button } from '@/components/ui/button';


function App() {
    // Para refrescar la lista de productos despu�s de añadir uno nuevo
    const handleProductAdded = () => {
        // Podrás llamar directamente a fetchProducts en ProductList
        // O podrás tener un estado compartido que ProductList escuche
        // Para simplificar, le damos una prop de recarga
        window.location.reload(); // Simple pero no ideal para apps grandes
        // Una mejor forma será tener un estado en App.js que ProductList escuche
    };

    return (
        <div className="App p-8 bg-gray-50"> 
            <h1 className="text-5xl font-extrabold text-green-800 tracking-tight leading-tight mb-10 text-center md:text-6xl lg:text-7xl">Gestión de Productos Full Stack</h1>
            <hr className="my-8 border-t-2 border-gray-200" />
            <ProductForm onProductAdded={handleProductAdded} />
            <hr className="my-8 border-t-2 border-gray-200" />
            <ProductList />
            <hr className="my-8 border-t-2 border-gray-200" />
            <StockView />
        </div>
    );
}

export default App;