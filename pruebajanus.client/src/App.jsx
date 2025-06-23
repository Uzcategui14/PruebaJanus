import React from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import StockView from './components/StockView';
import './App.css';

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
        <div className="App">
            <h1>Gesti�n de Productos Full Stack</h1>
            <ProductForm onProductAdded={handleProductAdded} />
            <hr /> {/* L�nea divisoria */}
            <ProductList />
            <hr />
            <StockView />
        </div>
    );
}

export default App;