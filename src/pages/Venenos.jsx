// src/pages/Venenos.jsx
import React, { useState, useEffect } from "react";
import "../styles/global.css";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext.js";
// ¡Ya no importamos useCart!

const LISTA_DE_FILTROS = [
  "roedores",
  "insectos",
  "pulgas y garrapatas",
  "hormigas",
];

const Venenos = () => {
  // ¡Ya no necesitamos 'selectedProduct', 'closeModal', 'addToCart', etc. aquí!
  const {
    venenos,
    loading,
    error,
    openModal, // <-- Solo necesitamos la función para ABRIR el modal
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("Todos");

  useEffect(() => {
    document.body.classList.add("page-venenos");
    return () => document.body.classList.remove("page-venenos");
  }, []);

  const filteredProducts = venenos
    .filter((prod) => {
      if (selectedCategoria === "Todos") return true;
      return prod.categoria?.toLowerCase() === selectedCategoria.toLowerCase();
    })
    .filter((prod) =>
      prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading)
    return (
      <div className="loading-spinner">Cargando productos de control...</div>
    );
  if (error) return <div className="error-message">Error: {error}</div>;

  const capitalizar = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <Link to="/" className="back-btn">
        ← Volver a inicio
      </Link>
      <h1>Control de Plagas</h1>
      <p>Soluciones efectivas para garrapatas, pulgas, roedores y más.</p>

      {/* Quick Nav */}
      <div className="quick-nav">
        <Link to="/alimentos">Alimentos</Link>
        <Link to="/higiene">Higiene</Link>
        <Link to="/accesorios">Accesorios</Link>
        <Link to="/venenos" className="active">
          Venenos
        </Link>
      </div>

      {/* Botones de filtro */}
      <div className="category-filter">
        <button
          className={`filter-btn ${
            selectedCategoria === "Todos" ? "active" : ""
          }`}
          onClick={() => setSelectedCategoria("Todos")}
        >
          Todos
        </button>
        {LISTA_DE_FILTROS.map((categoria) => (
          <button
            key={categoria}
            className={`filter-btn ${
              selectedCategoria === categoria ? "active" : ""
            }`}
            onClick={() => setSelectedCategoria(categoria)}
          >
            {capitalizar(categoria)}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="search-filter">
        <input
          className="search-input"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-container active">
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => (
              // ¡CAMBIO CLAVE! Solo llama a openModal
              <div
                key={prod.id}
                className="product-card"
                onClick={() => openModal(prod)}
              >
                <img
                  src={prod.imagen || "/img/default.jpg"}
                  alt={prod.nombre}
                />
                <h3>{prod.nombre}</h3>
                {prod.variaciones[0] ? (
                  <div className="price">
                    ${prod.variaciones[0].precio.toLocaleString()}
                  </div>
                ) : (
                  <div className="price">Consultar</div>
                )}
              </div>
            ))
          ) : (
            <p className="no-results-message">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      </div>

      {/* ¡CAMBIO CLAVE! Borramos todo el bloque del modal de aquí */}
      {/* {selectedProduct && ( ... )}  <-- TODO ESTO SE FUE */}
    </>
  );
};

export default Venenos;
