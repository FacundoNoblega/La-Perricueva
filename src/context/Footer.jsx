// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Columna 1: Ubicación */}
        <div className="footer-section">
          <h4>📍 LA PERRICUEVA</h4>
          <p>Catamarca, Argentina</p>
          <p style={{ fontSize: "0.8rem", color: "#666" }}>
            Tu tienda de confianza
          </p>
        </div>

        {/* Columna 2: Horarios */}
        <div className="footer-section">
          <h4>⏰ HORARIOS</h4>
          <p>Lunes a Sábado</p>
          <p className="highlight">9:00 - 13:00</p>
          <p className="highlight">17:00 - 21:00</p>
        </div>

        {/* Columna 3: Contacto */}
        <div className="footer-section">
          <h4>📞 CONTACTO</h4>
          <p>¿Dudas? Escribinos</p>
          <button
            onClick={() => window.open("https://wa.me/5493834701332", "_blank")}
            className="footer-btn"
          >
            WhatsApp
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 La Perricueva. Hecho con ❤️ y pelos de gato.</p>
      </div>
    </footer>
  );
};

export default Footer;
