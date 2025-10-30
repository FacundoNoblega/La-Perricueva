// src/pages/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import "../styles/global.css";

// 1. IMPORTAMOS LOS COMPONENTES
// Asegúrate que la ruta sea correcta. La tuya era '../context/CartSidebar.jsx'
// pero el archivo que me pasaste estaba en 'components'. La corrijo:
import { CartSidebar } from "../context/CartSidebar.jsx";
import { ProductModal } from "../context/ProductModal.jsx"; // Importamos el Modal

const Layout = () => {
  return (
    // 2. USAMOS UN FRAGMENT (<>) para no añadir divs innecesarios
    <>
      {/* 3. RENDERIZAMOS LOS ELEMENTOS FLOTANTES (FIJOS) PRIMERO */}
      {/* Estos tienen position:fixed y z-index alto */}
      <CartSidebar pageTitle="La Perricueva" />
      <ProductModal /> {/* <-- El Modal ahora vive aquí, globalmente */}
      {/* 4. AÑADIMOS LOS METEORITOS (también fijos) */}
      <div className="meteor-container">
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
      </div>
      {/* 5. RENDERIZAMOS EL CONTENIDO PRINCIPAL */}
      {/* Este div tiene position:relative y z-index:1 */}
      <div className="main-content">
        {/* Aquí se renderiza Index.jsx, Alimentos.jsx, etc. */}
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
