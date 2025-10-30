// src/pages/Layout.jsx
// --- VERSIÓN SIMPLE (Sin 'className' dinámico) ---

import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/global.css';

// Asegúrate que la ruta a tu componente sea correcta
import { CartSidebar } from '../context/CartSidebar.jsx'; 

const Layout = () => {

  return (
    // Esta es la clase estática original
    <div className="cosmic-universe">
      
      {/* El carrito ahora se renderiza aquí */}
      {/* Pásale el pageTitle o quítalo si 'sendToWhatsApp' ya no lo necesita */}
      <CartSidebar pageTitle="La Perricueva" />

      <div className="meteor-container">
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
      </div>

      {/* Contenido dinámico de cada página */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;