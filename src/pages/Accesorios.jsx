// src/pages/Accesorios.jsx
// --- VERSIÓN CORREGIDA (Usa Modal Global) ---

import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.js';
import { useCart } from '../context/CartContext.js';

const CATEGORIAS_FILTRO = ['perros', 'gatos', 'aves', 'general']; 

const Accesorios = () => {
  // --- ¡CAMBIO CLAVE! Obtenemos el estado/funciones del Modal desde el contexto ---
  const { 
    accesorios, 
    loading, 
    error, 
    selectedProduct, // El producto seleccionado (global)
    openModal,       // La función para abrir el modal (global)
    closeModal       // La función para cerrar el modal (global)
  } = useProducts();
  
  const { addToCart, activeButton } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  
  // --- ¡CAMBIO CLAVE! Eliminamos el estado local ---
  // const [selectedProduct, setSelectedProduct] = useState(null); // <-- BORRADO

  useEffect(() => {
    document.body.classList.add('page-accesorios');
    return () => document.body.classList.remove('page-accesorios');
  }, []);

  // ... (La lógica de filtrado robusto no cambia) ...
  const productsByCategoria = accesorios.filter(prod => {
    if (selectedCategoria === 'Todos') {
      return true; 
    }
    return prod.categoria?.toLowerCase() === selectedCategoria.toLowerCase();
  });
  const filteredProducts = productsByCategoria.filter(prod => 
    prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Estado local para los botones de filtro (esto se queda aquí)
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');

  if (loading) return <div className="loading-spinner">Cargando accesorios...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  const capitalizar = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <Link to="/" className="back-btn">← Volver a inicio</Link>
      <h1>Accesorios para Mascotas</h1>
      <p>Selección premium de collares, camas, juguetes, ropa y más.</p>

      {/* Quick Nav (no cambia) */}
      <div className="quick-nav">
        <Link to="/alimentos">Alimentos</Link>
        <Link to="/higiene">Higiene</Link>
        <Link to="/accesorios" className="active">Accesorios</Link>
        <Link to="/venenos">Venenos</Link>
      </div>

      {/* Botones de filtro (no cambia) */}
      <div className="category-filter"> 
        <button
          className={`filter-btn ${selectedCategoria === 'Todos' ? 'active' : ''}`}
          onClick={() => setSelectedCategoria('Todos')}
        >
          Todos
        </button>
        {CATEGORIAS_FILTRO.map(categoria => (
          <button
            key={categoria}
            className={`filter-btn ${selectedCategoria === categoria ? 'active' : ''}`}
            onClick={() => setSelectedCategoria(categoria)}
          >
            {capitalizar(categoria)} 
          </button>
        ))}
      </div>

      {/* Buscador (no cambia) */}
      <div className="search-filter">
        <input className="search-input" placeholder="Buscar accesorios..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="category-container active">
        <div className="product-grid">

          {/* Lógica de "No resultados" (no cambia) */}
          {accesorios.length === 0 && !loading ? (
            <p className="no-results-message">No hay accesorios para mostrar.</p>
          ) : productsByCategoria.length === 0 ? (
            <p className="no-results-message">No hay productos en la categoría "{capitalizar(selectedCategoria)}".</p>
          ) : filteredProducts.length === 0 ? (
            <p className="no-results-message">No se encontraron productos que coincidan con tu búsqueda.</p>
          ) : (
            
            filteredProducts.map(prod => (
              // --- ¡CAMBIO CLAVE! Llama a openModal global ---
              <div key={prod.id} className="product-card" onClick={() => openModal(prod)}>
                <img src={prod.imagen || '/img/default.jpg'} alt={prod.nombre} />
                <h3>{prod.nombre}</h3>
                  {prod.variaciones[0] ? (
                    <div className="price">${prod.variaciones[0].precio.toLocaleString()}</div>
                ) : (
                    <div className="price">Consultar</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ¡CAMBIO CLAVE! El modal ahora usa el estado global --- */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div className="product-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="product-page-header">
              <img src={selectedProduct.imagen || '/img/default.jpg'} alt={selectedProduct.nombre} />
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
                    <h3>{v.key}: {v.value}</h3>
                    <div className="price">${v.precio.toLocaleString()}</div>
                    <button
                      className={`add-to-cart-btn ${activeButton === key ? 'active' : ''}`}
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
      )}
    </>
  );
};

export default Accesorios;