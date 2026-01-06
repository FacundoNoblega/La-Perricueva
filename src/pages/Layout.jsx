// src/pages/Layout.jsx
import React, { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { ProductModal } from "../context/ProductModal.jsx";
import { useCart } from "../context/CartContext.js";
import {
  FaMusic,
  FaPause,
  FaShoppingCart,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

const Layout = () => {
  const {
    cart,
    notification,
    updateQuantity,
    total,
    sendToWhatsApp,
    clearCart,
  } = useCart();

  // Estado para abrir/cerrar el carrito lateral
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Lógica de música
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

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-container">
      {/* --- ¡AQUÍ ESTÁN LOS METEORITOS QUE FALTABAN! --- */}
      <div className="meteor-container">
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
      </div>
      {/* ----------------------------------------------- */}

      {/* 1. BOTÓN FLOTANTE DEL CARRITO (Reemplaza al Header) */}
      <div className="icon-container" onClick={toggleCart}>
        <div className="icon">
          <FaShoppingCart />
        </div>
        {totalItems > 0 && <span className="floating-badge">{totalItems}</span>}
      </div>

      {/* 2. PANEL LATERAL DEL CARRITO */}
      <div className={`cart-summary ${isCartOpen ? "active" : ""}`}>
        <div className="cart-header">
          <h3>Tu Pedido</h3>
          <button className="cart-close" onClick={toggleCart}>
            <FaTimes />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">El carrito está vacío 😢</div>
        ) : (
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.key} className="cart-item">
                <div style={{ flex: 1 }}>
                  <div className="cart-item-name">{item.name}</div>
                  <small>{item.variation}</small>
                </div>

                <div className="cart-item-controls">
                  <button
                    className="cart-btn"
                    onClick={() => updateQuantity(item.key, -1)}
                  >
                    -
                  </button>
                  <span className="cart-quantity">{item.quantity}</span>
                  <button
                    className="cart-btn"
                    onClick={() => updateQuantity(item.key, 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-price">
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}

            <div className="cart-total">Total: ${total.toLocaleString()}</div>

            <div className="cart-actions">
              <button
                className="modal-btn modal-btn-secondary"
                onClick={clearCart}
              >
                <FaTrash /> Vaciar
              </button>
              <button
                className="modal-btn modal-btn-primary"
                onClick={() => sendToWhatsApp("La Perricueva")}
              >
                Pedir por WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      <main>
        <Outlet />
      </main>

      {/* COMPONENTES GLOBALES */}
      <ProductModal />

      {/* Reproductor de Música */}
      <div style={musicStyles.container}>
        <audio ref={audioRef} loop>
          {/* Asegúrate de que musica.mp3 esté en la carpeta 'public' */}
          <source src="/musica.mp3" type="audio/mp3" />
        </audio>
        <button onClick={togglePlay} style={musicStyles.button}>
          {isPlaying ? <FaPause /> : <FaMusic />}
        </button>
      </div>

      {/* Notificación Toast (Alerta verde) */}
      {notification.show && (
        <div style={toastStyles}>✅ {notification.message}</div>
      )}
    </div>
  );
};

// Estilos inline para los controles flotantes (Música y Alerta)
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
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    fontSize: "20px",
    color: "#000",
  },
};

const toastStyles = {
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#28a745",
  color: "white",
  padding: "10px 25px",
  borderRadius: "25px",
  zIndex: 4000,
  fontWeight: "bold",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  animation: "fadeIn 0.3s",
  whiteSpace: "nowrap",
};

export default Layout;
