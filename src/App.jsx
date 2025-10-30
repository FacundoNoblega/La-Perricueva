// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Importa los Providers
import { ProductProvider } from './context/ProductContext.js';
import { CartProvider } from './context/CartContext.js';

// 2. Importa el Layout (el "marco" de la página)
import Layout from './pages/Layout.jsx';

// 3. Importa TODAS tus páginas
import Index from './pages/Index.jsx';
import Alimentos from './pages/Alimentos.jsx';
import Accesorios from './pages/Accesorios.jsx';
import Higiene from './pages/Higiene.jsx';
import Venenos from './pages/Venenos.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* 4. El Provider de Productos envuelve todo */}
      <ProductProvider>
        {/* 5. El Provider de Carrito envuelve todo (dentro de Productos) */}
        <CartProvider>
          <Routes>
            {/* 6. La ruta "/" usa el Layout como "marco" */}
            <Route path="/" element={<Layout />}>
              
              {/* 7. Estas rutas se dibujan DENTRO del <Outlet> del Layout */}
              <Route index element={<Index />} /> {/* La página de inicio */}
              <Route path="alimentos" element={<Alimentos />} />
              <Route path="accesorios" element={<Accesorios />} />
              <Route path="higiene" element={<Higiene />} />
              <Route path="venenos" element={<Venenos />} />
              
            </Route>
          </Routes>
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;