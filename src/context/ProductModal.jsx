// src/context/ProductModal.jsx
import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext.js";
import { useCart } from "../context/CartContext.js";

// --- SUB-COMPONENTE: FILA DE VARIACIÓN CON CÁLCULO DE CARRITO ---
const VariationRow = ({ product, variation, onAdd }) => {
  const { cart } = useCart(); // Necesitamos leer el carrito aquí
  const [qty, setQty] = useState(1);

  // 1. Buscamos si este producto YA está en el carrito
  // La clave debe coincidir con cómo la genera el CartContext: `${nombre}-${variacion}`
  const itemKey = `${product.nombre}-${variation.value}`;
  const itemInCart = cart.find((item) => item.key === itemKey);
  const qtyInCart = itemInCart ? itemInCart.quantity : 0;

  // 2. Calculamos el Stock Real TOTAL
  const totalStock = product.stock !== undefined ? product.stock : 0;

  // 3. Calculamos cuánto queda DISPONIBLE para agregar AHORA
  const availableStock = totalStock - qtyInCart;

  // Si la cantidad seleccionada supera lo disponible (porque acabamos de agregar), la bajamos a 1
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
    // SOLO suma si no nos pasamos de lo que queda disponible
    if (qty < availableStock) {
      setQty(qty + 1);
    }
  };

  const handleAgregar = (e) => {
    e.stopPropagation();
    onAdd(product.nombre, variation.value, variation.precio, qty, totalStock);
    // No hace falta resetear qty manual, el useEffect lo ajustará si cambia el availableStock
    setQty(1);
  };

  // CASO A: STOCK TOTAL 0 (Nunca hubo)
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

  // CASO B: YA TIENES TODO EL STOCK EN EL CARRITO
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
          ✅ Máximo alcanzado en carrito ({qtyInCart}/{totalStock})
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

  // CASO C: HAY STOCK DISPONIBLE PARA AGREGAR
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

        {/* Deshabilitamos el + si llegamos al tope disponible */}
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

      {/* Aviso inteligente de stock */}
      <div
        style={{
          fontSize: "0.8rem",
          color: "#aaa",
          marginBottom: "10px",
          fontStyle: "italic",
        }}
      >
        Disponibles: {availableStock}{" "}
        {qtyInCart > 0 && `(Tenés ${qtyInCart} en el carrito)`}
      </div>

      <button className="add-to-cart-btn" onClick={handleAgregar}>
        Agregar {qty} {qty > 1 ? "unidades" : "unidad"}
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
