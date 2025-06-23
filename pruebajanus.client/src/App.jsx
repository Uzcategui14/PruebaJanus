import React from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import StockView from './components/StockView';
import './App.css';

function App() {
    // Para refrescar la lista de productos después de añadir uno nuevo
    const handleProductAdded = () => {
        // Podrías llamar directamente a fetchProducts en ProductList
        // O podrías tener un estado compartido que ProductList escuche
        // Para simplificar, le damos una prop de recarga
        window.location.reload(); // Simple pero no ideal para apps grandes
        // Una mejor forma sería tener un estado en App.js que ProductList escuche
    };

    return (
        <div className="App">
            <h1>Gestión de Productos Full Stack</h1>
            <ProductForm onProductAdded={handleProductAdded} />
            <hr /> {/* Línea divisoria */}
            <ProductList />
            <hr />
            <StockView />
        </div>
    );
}

export default App;