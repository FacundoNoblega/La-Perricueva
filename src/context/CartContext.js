// src/context/CartContext.js
// --- VERSIÓN CORRECTA (La que SÍ "Salta") ---

import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);

  const addToCart = (productName, variation, price) => {
    const key = `${productName}(${variation})`;
    setCart(prev => {
      const existing = prev.find(item => item.key === key);
      if (existing) {
        return prev.map(item =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { key, name: productName, variation, price, quantity: 1 }];
      }
    });
    
    // --- ¡¡ESTA ES LA LÍNEA MÁGICA QUE QUIERES!! ---
    // Esto hace que el carrito "salte" (se abra)
    document.getElementById('cart-summary')?.classList.add('active');
    
    setActiveButton(key);
    setTimeout(() => setActiveButton(null), 300);
  };

  const updateQuantity = (key, delta) => {
    setCart(prev =>
      prev
        .map(item => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const sendToWhatsApp = (pageTitle) => {
    if (cart.length === 0) return alert('Carrito vacío');
    let msg = `Pedido desde ${pageTitle}:\n` + cart.map(item => `• ${item.key} x${item.quantity}`).join('\n');
    window.open(`https://wa.me/5493834240185?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cart,
    total,
    activeButton,
    addToCart,
    updateQuantity,
    clearCart,
    sendToWhatsApp
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};