// src/pages/Index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

const Index = () => {
  return (
    // Quitamos el fondo duplicado, el Layout.jsx ya lo maneja.
    <>
      <div className="hero">
        <img src="/img/titulo.png" alt="LA PERRICUEVA" className="title-image" />
        <img src="/img/logo.png" alt="Logo de LA PERRICUEVA" className="hero-logo" />
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

      <section className="arsenal-section">
        <h2 className="arsenal-title">El arsenal del héroe</h2>
        <div className="arsenal-grid">
          <Link to="/alimentos" className="arsenal-item">
            <img src="https://placehold.co/400x400/12121a/d4af37?text=Alimento" alt="Energía de combate" />
            <h3>Energía de combate</h3>
            <p>Proteínas, vitaminas y sabor para misiones diarias.</p>
          </Link>
          <Link to="/higiene" className="arsenal-item">
            <img src="https://placehold.co/400x400/12121a/d4af37?text=Shampoo" alt="Rituales de poder" />
            <h3>Rituales de poder</h3>
            <p>Shampoos, perfumes y tratamientos para mantener su fuerza.</p>
          </Link>
          <Link to="/accesorios" className="arsenal-item">
            <img src="https://placehold.co/400x400/12121a/d4af37?text=Collar" alt="Armadura y herramientas" />
            <h3>Armadura y herramientas</h3>
            <p>Collares resistentes, camas cómodas, juguetes indestructibles.</p>
          </Link>
          <Link to="/venenos" className="arsenal-item">
            <img src="https://placehold.co/400x400/12121a/d4af37?text=Venenos" alt="Defensa contra villanos" />
            <h3>Defensa contra villanos</h3>
            <p>Garrapatas, roedores y hormigas no tienen chance.</p>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;