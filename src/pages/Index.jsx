// src/pages/Index.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

const Index = () => {
  return (
    <>
      {/* 1. HERO SECTION */}
      <div className="hero">
        <img
          src="/img/titulo.png"
          alt="LA PERRICUEVA"
          className="title-image"
        />
        <img
          src="/img/logo.png"
          alt="Logo de LA PERRICUEVA"
          className="hero-logo"
        />
        <div className="impact-text">
          Tu mascota es un héroe. Nosotros le damos su armadura.
        </div>
        <div className="animals-runner">
          <div className="animal">🐶</div>
          <div className="animal">🐱</div>
          <div className="animal">🦜</div>
          <div className="animal">🐰</div>
          <div className="animal">🐶</div>
          <div className="animal">🐱</div>
          <div className="animal">🦜</div>
          <div className="animal">🐰</div>
        </div>
      </div>

      {/* 2. SECCIÓN DE PROMOS */}
      <section className="promos-section">
        <div className="promos-header">
          <h2>🔥 OFERTAS DEL CUARTEL 🔥</h2>
          <p>Equipamiento legendario a precios de cadete</p>
        </div>

        <div className="promo-box">
          <img
            src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=1000&auto=format&fit=crop"
            alt="Promo Especial"
          />
          <div className="promo-overlay">
            <h3>20% OFF en Alimentos Premium</h3>
            <p>Solo por tiempo limitado</p>
            <Link to="/alimentos" className="promo-btn">
              VER OFERTA
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ARSENAL (Categorías con TODAS las imágenes) */}
      <section className="arsenal-section">
        <h2 className="arsenal-title">El arsenal del héroe</h2>
        <div className="arsenal-grid">
          {/* ALIMENTOS - IMAGEN AGREGADA */}
          <Link to="/alimentos" className="arsenal-item">
            <img
              src="https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=400"
              alt="Energía de combate"
            />
            <h3>Alimentos</h3>
            <p>Proteínas, vitaminas y sabor para misiones diarias.</p>
          </Link>

          {/* HIGIENE - IMAGEN OK */}
          <Link to="/higiene" className="arsenal-item">
            <img
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400"
              alt="Rituales de poder"
            />
            <h3>Higiene</h3>
            <p>Shampoos, perfumes y tratamientos para mantener su fuerza.</p>
          </Link>

          {/* ACCESORIOS - IMAGEN OK */}
          <Link to="/accesorios" className="arsenal-item">
            <img
              src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400"
              alt="Armadura y herramientas"
            />
            <h3>Accesorios</h3>
            <p>
              Collares resistentes, camas cómodas, juguetes indestructibles.
            </p>
          </Link>

          {/* VENENOS - IMAGEN AGREGADA */}
          <Link to="/venenos" className="arsenal-item">
            <img
              src="https://images.unsplash.com/photo-1603975716386-2c938c5b08df?auto=format&fit=crop&q=80&w=400"
              alt="Defensa contra villanos"
            />
            <h3>Defensa contra villanos</h3>
            <p>Garrapatas, roedores y hormigas no tienen chance.</p>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
