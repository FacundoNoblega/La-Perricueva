// src/context/ProductModal.jsx
import React, { useState } from "react";
import { useProducts } from "../context/ProductContext.js";
import { useCart } from "../context/CartContext.js";

// Sub-componente para manejar el contador de cada variación individualmente
const VariationRow = ({ product, variation, onAdd }) => {
  const [qty, setQty] = useState(1);

  const handleRestar = (e) => {
    e.stopPropagation();
    if (qty > 1) setQty(qty - 1);
  };

  const handleSumar = (e) => {
    e.stopPropagation();
    setQty(qty + 1);
  };

  const handleAgregar = (e) => {
    e.stopPropagation();
    onAdd(product.nombre, variation.value, variation.precio, qty);
    setQty(1); // Reseteamos a 1 después de agregar
  };

  return (
    <div className="variation-card">
      <h3>
        {variation.key}: {variation.value}
      </h3>
      <div className="price">${variation.precio.toLocaleString()}</div>

      {/* Selector de Cantidad */}
      <div
        className="qty-selector"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "10px 0",
        }}
      >
        <button onClick={handleRestar} style={btnStyles}>
          -
        </button>
        <span style={{ fontWeight: "bold" }}>{qty}</span>
        <button onClick={handleSumar} style={btnStyles}>
          +
        </button>
      </div>

      <button className="add-to-cart-btn" onClick={handleAgregar}>
        Agregar
      </button>
    </div>
  );
};

const btnStyles = {
  width: "30px",
  height: "30px",
  cursor: "pointer",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

export const ProductModal = () => {
  const { selectedProduct, closeModal } = useProducts();
  const { addToCart } = useCart();

  if (!selectedProduct) return null;

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
          <div className="no-variations-message">Sin stock por el momento.</div>
        )}

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
