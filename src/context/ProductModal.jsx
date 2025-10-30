// src/context/ProductModal.jsx
import React from "react";
import { useProducts } from "../context/ProductContext.js";
import { useCart } from "../context/CartContext.js";

// Este componente renderiza el modal globalmente
export const ProductModal = () => {
  // 1. Obtiene el estado global del ProductContext
  const { selectedProduct, closeModal } = useProducts();
  const { addToCart, activeButton } = useCart();

  // 2. Si no hay producto seleccionado, no renderiza nada
  if (!selectedProduct) {
    return null;
  }

  // 3. Si hay producto, renderiza el modal
  return (
    <div className="product-modal-overlay" onClick={closeModal}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>
        <div className="product-page-header">
          <img
            src={selectedProduct.imagen || "/img/default.jpg"}
            alt={selectedProduct.nombre}
          />
          <h2>{selectedProduct.nombre}</h2>
        </div>
        <p>{selectedProduct.descripcion}</p>

        {selectedProduct.variaciones.length === 0 && (
          <div className="no-variations-message">
            Este producto está disponible. ¡Consúltanos el precio por WhatsApp!
          </div>
        )}

        <div className="product-variations">
          {selectedProduct.variaciones.map((v, i) => {
            const key = `${selectedProduct.nombre}(${v.value})`;
            return (
              <div key={i} className="variation-card">
                <h3>
                  {v.key}: {v.value}
                </h3>
                <div className="price">${v.precio.toLocaleString()}</div>
                <button
                  className={`add-to-cart-btn ${
                    activeButton === key ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(selectedProduct.nombre, v.value, v.precio);
                  }}
                >
                  Agregar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
