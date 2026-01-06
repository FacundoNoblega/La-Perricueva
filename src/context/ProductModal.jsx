// src/context/ProductModal.jsx
import React, { useState } from "react";
import { useProducts } from "../context/ProductContext.js";
import { useCart } from "../context/CartContext.js";

// --- SUB-COMPONENTE: FILA DE VARIACIÓN CON SELECTOR DE CANTIDAD ---
const VariationRow = ({ product, variation, onAdd }) => {
  const [qty, setQty] = useState(1);

  const handleRestar = (e) => {
    e.stopPropagation(); // Evita que el clic cierre el modal
    if (qty > 1) setQty(qty - 1);
  };

  const handleSumar = (e) => {
    e.stopPropagation();
    setQty(qty + 1);
  };

  const handleAgregar = (e) => {
    e.stopPropagation();
    // Enviamos al carrito: Nombre, Variación, Precio y CANTIDAD
    onAdd(product.nombre, variation.value, variation.precio, qty);
    setQty(1); // Reseteamos el contador a 1 después de agregar
  };

  return (
    <div className="variation-card">
      <h3>
        {variation.key}: {variation.value}
      </h3>
      <div className="price">${variation.precio.toLocaleString()}</div>

      {/* Selector de Cantidad Estilizado (Círculos Dorados) */}
      <div className="qty-selector">
        <button onClick={handleRestar} className="qty-btn">
          -
        </button>
        <span className="qty-value">{qty}</span>
        <button onClick={handleSumar} className="qty-btn">
          +
        </button>
      </div>

      <button className="add-to-cart-btn" onClick={handleAgregar}>
        Agregar
      </button>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DEL MODAL ---
export const ProductModal = () => {
  const { selectedProduct, closeModal } = useProducts();
  const { addToCart } = useCart();

  // Si no hay producto seleccionado, no renderizamos nada
  if (!selectedProduct) return null;

  return (
    <div className="product-modal-overlay" onClick={closeModal}>
      {/* stopPropagation evita que al hacer clic DENTRO del modal, se cierre */}
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

        {/* Mensaje si no hay variaciones/stock */}
        {selectedProduct.variaciones.length === 0 && (
          <div
            className="no-variations-message"
            style={{ textAlign: "center", color: "#888", fontStyle: "italic" }}
          >
            Sin stock por el momento.
          </div>
        )}

        {/* Lista de Variaciones (Kilos, Tallas, etc.) */}
        <div className="product-variations">
          {selectedProduct.variaciones.map((v, i) => (
            <VariationRow
              key={i}
              product={selectedProduct}
              variation={v}
              onAdd={addToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
