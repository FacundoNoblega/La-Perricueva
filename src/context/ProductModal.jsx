// src/context/ProductModal.jsx
import React, { useState } from "react";
import { useProducts } from "../context/ProductContext.js";
import { useCart } from "../context/CartContext.js";

// --- SUB-COMPONENTE: FILA DE VARIACIÓN CON CONTROL DE STOCK ---
const VariationRow = ({ product, variation, onAdd }) => {
  const [qty, setQty] = useState(1);

  // Leemos el stock desde el producto (que viene de Airtable)
  // Si no viniera el dato, asumimos 0 para no romper nada
  const maxStock = product.stock !== undefined ? product.stock : 0;

  const handleRestar = (e) => {
    e.stopPropagation();
    if (qty > 1) setQty(qty - 1);
  };

  const handleSumar = (e) => {
    e.stopPropagation();
    // SOLO suma si no nos pasamos del stock
    if (qty < maxStock) {
      setQty(qty + 1);
    }
  };

  const handleAgregar = (e) => {
    e.stopPropagation();
    // Pasamos el stock máximo al carrito para que valide también
    onAdd(product.nombre, variation.value, variation.precio, qty, maxStock);
    setQty(1);
  };

  // CASO 1: NO HAY STOCK (Producto Agotado)
  if (maxStock <= 0) {
    return (
      <div
        className="variation-card disabled"
        style={{ opacity: 0.5, pointerEvents: "none" }}
      >
        <h3>
          {variation.key}: {variation.value}
        </h3>
        <div className="price" style={{ color: "#888" }}>
          SIN STOCK
        </div>
        <button
          className="add-to-cart-btn"
          disabled
          style={{
            background: "#444",
            border: "1px solid #666",
            color: "#aaa",
          }}
        >
          Agotado
        </button>
      </div>
    );
  }

  // CASO 2: HAY STOCK (Normal)
  return (
    <div className="variation-card">
      <h3>
        {variation.key}: {variation.value}
      </h3>
      <div className="price">${variation.precio.toLocaleString()}</div>

      {/* Selector de Cantidad */}
      <div className="qty-selector">
        <button onClick={handleRestar} className="qty-btn">
          -
        </button>

        <span className="qty-value">{qty}</span>

        {/* Deshabilitamos el + si llegamos al tope */}
        <button
          onClick={handleSumar}
          className="qty-btn"
          disabled={qty >= maxStock}
          style={qty >= maxStock ? { opacity: 0.3, cursor: "not-allowed" } : {}}
        >
          +
        </button>
      </div>

      {/* Aviso de stock restante */}
      <div
        style={{
          fontSize: "0.8rem",
          color: "#aaa",
          marginBottom: "10px",
          fontStyle: "italic",
        }}
      >
        (Disponibles: {maxStock})
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
          <div
            className="no-variations-message"
            style={{ textAlign: "center", color: "#888", fontStyle: "italic" }}
          >
            Sin stock por el momento.
          </div>
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
