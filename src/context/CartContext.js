// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );

  // Estado para la notificación (Toast)
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  // AHORA RECIBE 'quantity' (por defecto 1 si no se pasa nada)
  const addToCart = (productName, variation, price, quantity = 1) => {
    const key = `${productName}(${variation})`;

    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          { key, name: productName, variation, price, quantity: quantity },
        ];
      }
    });

    // 1. YA NO ABRIMOS EL CARRITO AUTOMÁTICAMENTE
    // document.getElementById("cart-summary")?.classList.add("active"); <-- ELIMINADO

    // 2. ACTIVAMOS LA NOTIFICACIÓN
    showNotification(`¡Agregaste ${quantity} x ${productName} (${variation})!`);
  };

  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 3000); // Se va a los 3 segundos
  };

  const updateQuantity = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const sendToWhatsApp = (pageTitle) => {
    if (cart.length === 0) return alert("Carrito vacío");
    let msg =
      `Pedido desde ${pageTitle}:\n` +
      cart.map((item) => `• ${item.key} x${item.quantity}`).join("\n");
    window.open(
      `https://wa.me/5493834701332?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cart,
    total,
    notification, // Exportamos la notificación para usarla en el Layout
    addToCart,
    updateQuantity,
    clearCart,
    sendToWhatsApp,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
