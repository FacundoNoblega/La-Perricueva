// src/context/ProductModal.jsx
import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext.js";
import { useCart } from "../context/CartContext.js";

// --- SUB-COMPONENTE: FILA DE VARIACIÓN ---
const VariationRow = ({ product, variation, onAdd }) => {
  const { cart } = useCart();
  const [qty, setQty] = useState(1);

  // Clave única para encontrar el item en el carrito
  const itemKey = `${product.nombre}-${variation.value}`;
  const itemInCart = cart.find((item) => item.key === itemKey);
  const qtyInCart = itemInCart ? itemInCart.quantity : 0;

  // LEER STOCK: Prioridad a la variación, sino al general
  const totalStock =
    variation.stock !== undefined ? variation.stock : product.stock || 0;

  // Calcular disponible real
  const availableStock = totalStock - qtyInCart;

  // Ajustar cantidad si supera el disponible al renderizar
  useEffect(() => {
    if (qty > availableStock && availableStock > 0) {
      setQty(1);
    }
  }, [availableStock, qty]);

  const handleRestar = (e) => {
    e.stopPropagation();
    if (qty > 1) setQty(qty - 1);
  };

  const handleSumar = (e) => {
    e.stopPropagation();
    if (qty < availableStock) {
      setQty(qty + 1);
    }
  };

  const handleAgregar = (e) => {
    e.stopPropagation();
    onAdd(product.nombre, variation.value, variation.precio, qty, totalStock);
    setQty(1);
  };

  // CASO A: AGOTADO (Stock total 0)
  if (totalStock <= 0) {
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

  // CASO B: LÍMITE ALCANZADO EN CARRITO
  if (availableStock <= 0) {
    return (
      <div className="variation-card" style={{ borderColor: "#d4af37" }}>
        <h3>
          {variation.key}: {variation.value}
        </h3>
        <div className="price">${variation.precio.toLocaleString()}</div>

        <div
          style={{
            background: "rgba(212, 175, 55, 0.2)",
            padding: "10px",
            borderRadius: "8px",
            color: "#d4af37",
            fontWeight: "bold",
            fontSize: "0.9rem",
            margin: "15px 0",
          }}
        >
          ✅ Máximo alcanzado ({qtyInCart}/{totalStock})
        </div>

        <button
          className="add-to-cart-btn"
          disabled
          style={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          Límite alcanzado
        </button>
      </div>
    );
  }

  // CASO C: DISPONIBLE
  return (
    <div className="variation-card">
      <h3>
        {variation.key}: {variation.value}
      </h3>
      <div className="price">${variation.precio.toLocaleString()}</div>

      <div className="qty-selector">
        <button onClick={handleRestar} className="qty-btn">
          -
        </button>
        <span className="qty-value">{qty}</span>
        <button
          onClick={handleSumar}
          className="qty-btn"
          disabled={qty >= availableStock}
          style={
            qty >= availableStock ? { opacity: 0.3, cursor: "not-allowed" } : {}
          }
        >
          +
        </button>
      </div>

      <div
        style={{
          fontSize: "0.8rem",
          color: "#aaa",
          marginBottom: "10px",
          fontStyle: "italic",
        }}
      >
        Disponibles: {availableStock}{" "}
        {qtyInCart > 0 && `(En carrito: ${qtyInCart})`}
      </div>

      <button className="add-to-cart-btn" onClick={handleAgregar}>
        Agregar {qty}
      </button>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
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
