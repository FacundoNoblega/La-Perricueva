// src/components/CartSidebar.jsx
// --- ESTA ES LA VERSIÓN CORRECTA (La que SÍ "Salta") ---

import React, { useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext'; 

export const CartSidebar = ({ pageTitle }) => {
  
  // ¡Correcto! Solo usa 'useCart'
  const { cart, total, updateQuantity, clearCart, sendToWhatsApp } = useCart();
  
  const cartSummaryRef = useRef(null);

  // ¡Correcto! Usa 'getElementById' para cerrar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('.icon-container')) {
        return;
      }
      if (cartSummaryRef.current && !cartSummaryRef.current.contains(e.target)) {
        document.getElementById('cart-summary')?.classList.remove('active');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); 

  // ¡Correcto! No hay 'if (selectedProduct) return null'
  return (
    <>
      <div className="icon-container">
        <div className="icon" onClick={() => document.getElementById('cart-summary')?.classList.toggle('active')}>
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99-.9-1.99-2H3c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h1.99C5.99 4 7 4.9 7 6h10c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H7zm10-6H7v4h10v-4z" />
          </svg>
          
          {cart.length > 0 && <span className="cart-badge">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>}
        </div>
      </div>

      <div className="cart-summary" id="cart-summary" ref={cartSummaryRef}>
        <div className="cart-header">
          <h3>Carrito</h3>
          <button className="cart-close" onClick={() => document.getElementById('cart-summary')?.classList.remove('active')}>×</button>
        </div>
        <div id="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">Tu carrito está vacío</div>
          ) : (
            cart.map(item => (
              <div key={item.key} className="cart-item">
                <div className="cart-item-name">{item.key}</div>
                <div className="cart-item-controls">
                  <button className="cart-btn" onClick={() => updateQuantity(item.key, -1)}>–</button>
                  <span className="cart-quantity">{item.quantity}</span>
                  <button className="cart-btn" onClick={() => updateQuantity(item.key, 1)}>+</button>
                </div>
                <div className="cart-item-price">${(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
        <div className="cart-total">Total: ${total.toLocaleString()}</div>
        <div className="cart-actions">
          <button className="modal-btn modal-btn-secondary" onClick={clearCart}>Vaciar carrito</button>
          <button className="modal-btn modal-btn-primary" onClick={() => sendToWhatsApp(pageTitle)}>WhatsApp</button>
        </div>
      </div>
    </>
  );
};