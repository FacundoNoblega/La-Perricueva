// src/pages/Accesorios.jsx
import React, { useState, useEffect } from "react";
import "../styles/global.css";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext.js";
// ¡Ya no importamos useCart!

const CATEGORIAS_FILTRO = ["perros", "gatos", "aves", "general"];

const Accesorios = () => {
  // ¡Ya no necesitamos 'selectedProduct', 'closeModal', 'addToCart', etc. aquí!
  const {
    accesorios,
    loading,
    error,
    openModal, // <-- Solo necesitamos la función para ABRIR el modal
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("Todos");

  useEffect(() => {
    document.body.classList.add("page-accesorios");
    return () => document.body.classList.remove("page-accesorios");
  }, []);

  const productsByCategoria = accesorios.filter((prod) => {
    if (selectedCategoria === "Todos") {
      return true;
    }
    return prod.categoria?.toLowerCase() === selectedCategoria.toLowerCase();
  });
  const filteredProducts = productsByCategoria.filter((prod) =>
    prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <div className="loading-spinner">Cargando accesorios...</div>;
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
      <h1>Accesorios para Mascotas</h1>
      <p>Selección premium de collares, camas, juguetes, ropa y más.</p>

      {/* Quick Nav */}
      <div className="quick-nav">
        <Link to="/alimentos">Alimentos</Link>
        <Link to="/higiene">Higiene</Link>
        <Link to="/accesorios" className="active">
          Accesorios
        </Link>
        <Link to="/venenos">Venenos</Link>
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
        {CATEGORIAS_FILTRO.map((categoria) => (
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
          placeholder="Buscar accesorios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-container active">
        <div className="product-grid">
          {accesorios.length === 0 && !loading ? (
            <p className="no-results-message">
              No hay accesorios para mostrar.
            </p>
          ) : productsByCategoria.length === 0 ? (
            <p className="no-results-message">
              No hay productos en la categoría "{capitalizar(selectedCategoria)}
              ".
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="no-results-message">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          ) : (
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
          )}
        </div>
      </div>

      {/* ¡CAMBIO CLAVE! Borramos todo el bloque del modal de aquí */}
      {/* {selectedProduct && ( ... )}  <-- TODO ESTO SE FUE */}
    </>
  );
};

export default Accesorios;
