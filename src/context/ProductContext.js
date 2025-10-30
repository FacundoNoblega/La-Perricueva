// src/context/ProductContext.js
// --- VERSIÓN CORREGIDA (Maneja el Modal Global) ---

import React, { createContext, useState, useEffect, useContext } from 'react';

// ... (Configuración de Airtable no cambia) ...
const AIRTABLE_TOKEN = "patKuJCosiQZOwtbX.b3a33c79955282a8090d27589c0e7d0098aabf3092e943a9c1f469be75f51d6e";
const AIRTABLE_BASE_ID = "appcxfwzR2iZkPXT3";
const TABLE_NAMES = ['Alimentos', 'Accesorios', 'Higiene', 'Venenos']; 

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

// ... (processAirtableData no cambia) ...
const processAirtableData = (allProductsRaw) => {
  const products = {}; 

  try {
    allProductsRaw.forEach(product => {
      
      if (!product || !product.nombre) {
        return; 
      }
      
      const nombre = product.nombre;

      // Crear el producto si no existe
      if (!products[nombre]) {
        products[nombre] = {
          // 'id' se asignará más abajo, usando el ID único de Airtable
          nombre: nombre,
          categoria: product.categoria, 
          descripcion: product.descripcion,
          imagen: product.imagen,
          variaciones: [], 
          categoria_app: product.categoria_app, 
        };
        // Manejo de imágenes
        if (Array.isArray(product.imagen) && product.imagen.length > 0) {
            products[nombre].imagen = product.imagen[0].url;
        } else {
            products[nombre].imagen = product.imagen;
        }
      }

      // Validamos el precio de ESTA VARIACIÓN
      const precio = parseFloat(product.precio);

      if (isNaN(precio) || precio === 0) {
        return;
      }

      // Si el precio es válido (> 0), añadimos la variación
      let key = '';
      let value = '';

      if (product.peso) {
        key = 'Peso';
        value = product.peso;
      } else if (product.talla) {
        key = 'Talla';
        value = product.talla;
      }

      if (value) {
        products[nombre].variaciones.push({
          key: key,
          value: value,
          precio: precio,
        });
      }
    });
  } catch (err) {
    throw new Error(`Error procesando los datos: ${err.message}`);
  }
  
  // Ahora asignamos el ID único al producto agrupado
  const groupedProducts = Object.values(products);
  
  // Volvemos a mapear para asignar el ID único basado en el primer producto raw que encontramos
  // Esto es un poco complejo, pero asegura que el ID sea único
  const finalProducts = groupedProducts.map(prod => {
      const rawProduct = allProductsRaw.find(p => p.nombre === prod.nombre);
      return {
          ...prod,
          id: rawProduct.id // ¡Usamos el ID único de Airtable (ej: rec123abc)!
      };
  });

  return finalProducts;
};

// 4. --- El Proveedor del Contexto ---
export const ProductProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [alimentos, setAlimentos] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  const [higiene, setHigiene] = useState([]);
  const [venenos, setVenenos] = useState([]);

  // --- ¡CAMBIO CLAVE! AÑADIMOS ESTADO GLOBAL PARA EL MODAL ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);
  // --- FIN DEL CAMBIO ---

  // 5. --- El useEffect que hace el fetch a AIRTABLE ---
  useEffect(() => {
    
    // ... (fetchTable no cambia) ...
    const fetchTable = async (tableName) => {
      let allRecords = [];
      let offset = null;
      const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
      
      const params = new URLSearchParams({
        pageSize: '100',
        view: 'APIView'
      });

      try {
        do {
          if (offset) {
            params.set('offset', offset);
          } else {
            params.delete('offset');
          }

          const fetchUrl = `${baseUrl}?${params.toString()}`;

          const response = await fetch(fetchUrl, {
            headers: {
              'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error en Tabla: ${tableName}. ¿Creaste la 'APIView' para esta tabla? (Mensaje: ${response.statusText})`);
          }
          
          const jsonData = await response.json();
          allRecords.push(...jsonData.records);
          offset = jsonData.offset;

        } while (offset);

      } catch (err) {
        console.error(`Error en fetchTable (${tableName}):`, err);
        throw err;
      }
      
      // ... (El mapeo de 'id' corregido no cambia) ...
      return allRecords.map(record => ({
        ...record.fields, // 1. Los campos de Airtable
        id: record.id,     // 2. El ID de Airtable ¡SOBRESCRIBE y GANA!
        categoria_app: tableName 
      }));
    };

    // ... (fetchAllProducts no cambia) ...
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const results = await Promise.all(TABLE_NAMES.map(fetchTable));
        const allProductsRaw = results.flat(); 

        if (allProductsRaw.length === 0) {
            throw new Error('No se encontraron productos en Airtable.');
        }

        const allProducts = processAirtableData(allProductsRaw);

        setAlimentos(allProducts.filter(p => p.categoria_app === 'Alimentos'));
        setAccesorios(allProducts.filter(p => p.categoria_app === 'Accesorios'));
        setHigiene(allProducts.filter(p => p.categoria_app === 'Higiene' || p.categoria_app === 'Aigiene'));
        setVenenos(allProducts.filter(p => p.categoria_app === 'Venenos'));

      } catch (err)
 {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // 6. El valor que comparte el Provider (no cambia)
  const value = {
    loading,
    error,
    alimentos,
    accesorios,
    higiene,
    venenos,
    
    // --- ¡CAMBIO CLAVE! COMPARTIMOS EL ESTADO DEL MODAL ---
    selectedProduct,
    openModal,
    closeModal
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};