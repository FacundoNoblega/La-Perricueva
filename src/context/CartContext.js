// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Inicializamos el carrito leyendo del localStorage (para no perder datos al recargar)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("perricueva_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  // Guardamos en localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem("perricueva_cart", JSON.stringify(cart));
  }, [cart]);

  // Mostrar notificación temporal
  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  // 1. AGREGAR AL CARRITO (Con validación de Stock)
  const addToCart = (name, variation, price, quantity, maxStock) => {
    const key = `${name}-${variation}`;

    // Aseguramos que los números sean números
    const qtyToAdd = parseInt(quantity, 10);
    const limit = parseInt(maxStock, 10);

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.key === key);

      if (existingItem) {
        // Si ya existe, sumamos lo que hay + lo nuevo
        const newTotal = existingItem.quantity + qtyToAdd;

        // ¡AQUÍ ESTÁ EL FRENO!
        if (newTotal > limit) {
          showNotification(`¡Ups! Stock máximo: ${limit} u.`);
          return prevCart; // Devolvemos el carrito sin cambios
        }

        showNotification("Cantidad actualizada 🛒");
        return prevCart.map((item) =>
          item.key === key ? { ...item, quantity: newTotal } : item
        );
      } else {
        // Si es nuevo, verificamos que no pidan más que el stock de una (raro por el modal, pero por seguridad)
        if (qtyToAdd > limit) {
          showNotification(`Solo hay ${limit} disponibles.`);
          return prevCart;
        }

        showNotification("¡Agregado al equipo! 🐶");
        // Guardamos el 'stock' dentro del item para usarlo después en el panel lateral
        return [
          ...prevCart,
          { key, name, variation, price, quantity: qtyToAdd, stock: limit },
        ];
      }
    });
  };

  // 2. ACTUALIZAR CANTIDAD (Desde el panel lateral)
  const updateQuantity = (key, amount) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.key === key) {
          const newQuantity = item.quantity + amount;

          // No permitir menos de 1
          if (newQuantity < 1) return item;

          // No permitir más del stock guardado
          if (amount > 0 && item.stock && newQuantity > item.stock) {
            showNotification(`Máximo disponible: ${item.stock}`);
            return item; // No cambiamos nada
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // 3. ELIMINAR ITEM (Si la cantidad llega a 0 con el botón eliminar directo)
  const removeFromCart = (key) => {
    setCart((prevCart) => prevCart.filter((item) => item.key !== key));
  };

  // 4. VACIAR CARRITO
  const clearCart = () => {
    setCart([]);
    showNotification("Carrito vaciado 🗑️");
  };

  // 5. CALCULAR TOTAL
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 6. ENVIAR A WHATSAPP
  const sendToWhatsApp = (businessName) => {
    if (cart.length === 0) return;

    let message = `Hola *${businessName}*, quiero realizar el siguiente pedido: \n\n`;

    cart.forEach((item) => {
      message += `▪️ *${item.name}* (${item.variation}) x${item.quantity}\n`;
      message += `   $${(item.price * item.quantity).toLocaleString()}\n`;
    });

    message += `\n*TOTAL: $${total.toLocaleString()}*`;
    message += `\n\nEspero confirmación. Gracias.`;

    const url = `https://wa.me/5493834701332?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        notification,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
        sendToWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
