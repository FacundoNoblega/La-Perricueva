// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // <-- Asegúrate de importar App
import './styles/global.css'; // (o tu archivo de estilos global)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* <-- SOLO DEBE RENDERIZAR APP */}
  </React.StrictMode>
);
// NO HABÍA NADA MALO EXCEPTO UNA LLAVE "}" EXTRA AL FINAL DE TU ARCHIVO ORIGINAL