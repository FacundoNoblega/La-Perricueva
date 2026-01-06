// src/pages/Layout.jsx
import React, { useState, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import { ProductModal } from "../context/ProductModal.jsx";
import { useCart } from "../context/CartContext.js"; // Importamos para ver la notificación
import { FaMusic, FaPause, FaShoppingCart } from "react-icons/fa"; // Asegúrate de tener react-icons

const Layout = () => {
  const { cart, notification } = useCart(); // Traemos la notificación del contexto

  // --- LÓGICA DE MÚSICA ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  // ------------------------

  // Calculamos cantidad total para el globito del carrito
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Header Fijo */}
      <header className="main-header">
        <div className="logo">
          <h1></h1>
        </div>
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/alimentos">Alimentos</Link>
          {/* ... tus otros links ... */}
        </nav>

        {/* Icono Carrito */}
        <div className="cart-icon-container">
          <FaShoppingCart size={24} />
          {totalItems > 0 && <span className="badge">{totalItems}</span>}
        </div>
      </header>

      {/* Contenido Principal */}
      <main>
        <Outlet />
      </main>

      {/* --- COMPONENTES GLOBALES --- */}

      {/* 1. Modal de Producto */}
      <ProductModal />

      {/* 2. Reproductor de Música */}
      <div style={musicStyles.container}>
        <audio ref={audioRef} loop>
          {/* IMPORTANTE: Pon tu archivo 'musica.mp3' en la carpeta 'public' */}
          <source src="/musica.mp3" type="audio/mp3" />
        </audio>
        <button onClick={togglePlay} style={musicStyles.button}>
          {isPlaying ? <FaPause /> : <FaMusic />}
        </button>
      </div>

      {/* 3. Notificación Toast (Alerta) */}
      {notification.show && (
        <div style={toastStyles}>✅ {notification.message}</div>
      )}
    </div>
  );
};

// Estilos rápidos (puedes moverlos a tu CSS)
const musicStyles = {
  container: { position: "fixed", bottom: "20px", left: "20px", zIndex: 3000 },
  button: {
    background: "#FFD700",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const toastStyles = {
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#28a745",
  color: "white",
  padding: "10px 20px",
  borderRadius: "25px",
  zIndex: 4000,
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  fontWeight: "bold",
  animation: "fadeIn 0.3s",
};

export default Layout;
