// src/pages/Venenos.jsx
// --- VERSIÓN CORREGIDA (Usa Modal Global) ---

import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.js';
import { useCart } from '../context/CartContext.js';

const LISTA_DE_FILTROS = ['roedores', 'insectos', 'pulgas y garrapatas', 'hormigas']; 

const Venenos = () => {
  // --- ¡CAMBIO CLAVE! Obtenemos el estado/funciones del Modal desde el contexto ---
  const { 
    venenos, 
    loading, 
    error, 
    selectedProduct, // El producto seleccionado (global)
    openModal,       // La función para abrir el modal (global)
    closeModal       // La función para cerrar el modal (global)
  } = useProducts();

  const { addToCart, activeButton } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');

  // --- ¡CAMBIO CLAVE! Eliminamos el estado local ---
  // const [selectedProduct, setSelectedProduct] = useState(null); // <-- BORRADO

  useEffect(() => {
    document.body.classList.add('page-venenos');
    return () => document.body.classList.remove('page-venenos');
  }, []);

  // ... (La lógica de filtrado robusto no cambia) ...
  const filteredProducts = venenos
    .filter(prod => {
      if (selectedCategoria === 'Todos') return true; 
      return prod.categoria?.toLowerCase() === selectedCategoria.toLowerCase();
    })
    .filter(prod => 
      prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  if (loading) return <div className="loading-spinner">Cargando productos de control...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  const capitalizar = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <Link to="/" className="back-btn">← Volver a inicio</Link>
      <h1>Control de Plagas</h1>
      <p>Soluciones efectivas para garrapatas, pulgas, roedores y más.</p>

      {/* Quick Nav (no cambia) */}
      <div className="quick-nav">
        <Link to="/alimentos">Alimentos</Link>
        <Link to="/higiene">Higiene</Link>
        <Link to="/accesorios">Accesorios</Link>
        <Link to="/venenos" className="active">Venenos</Link>
      </div>

      {/* Botones de filtro (no cambia) */}
      <div className="category-filter"> 
        <button
          className={`filter-btn ${selectedCategoria === 'Todos' ? 'active' : ''}`}
          onClick={() => setSelectedCategoria('Todos')}
        >
          Todos
        </button>
        {LISTA_DE_FILTROS.map(categoria => (
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
        <input className="search-input" placeholder="Buscar productos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="category-container active">
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
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
          ) : (
            <p className="no-results-message">No se encontraron productos que coincidan con tu búsqueda.</p>
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

export default Venenos;