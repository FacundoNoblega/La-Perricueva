// src/context/ProductContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

// ... Configuración de Airtable ...
const AIRTABLE_TOKEN =
  "patKuJCosiQZOwtbX.b3a33c79955282a8090d27589c0e7d0098aabf3092e943a9c1f469be75f51d6e";
const AIRTABLE_BASE_ID = "appcxfwzR2iZkPXT3";
const TABLE_NAMES = ["Alimentos", "Accesorios", "Higiene", "Venenos"];

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

// --- PROCESAMIENTO INTELIGENTE DE DATOS ---
const processAirtableData = (allProductsRaw) => {
  const productsMap = {};

  try {
    allProductsRaw.forEach((product) => {
      // 1. DETECTAR EL NOMBRE (CORREGIDO)
      // Ahora el nombre viene explícitamente en la propiedad 'nombre' que forzamos abajo
      const nombreRaw = product.nombre;

      if (!nombreRaw) return;

      const nombre = nombreRaw.trim();

      // 2. LEER LA ESPECIE/CATEGORIA
      let especie = "General";
      if (product.categoria) {
        especie = Array.isArray(product.categoria)
          ? product.categoria[0]
          : product.categoria;
      }
      especie = especie.toString().toLowerCase().trim();

      // 3. CREAR CLAVE DE AGRUPACIÓN
      const groupKey = `${nombre}|${especie}`;

      if (!productsMap[groupKey]) {
        let displayNombre = nombre;
        // Agregamos (Perros)/(Gatos) si el nombre no lo incluye
        if (!nombre.toLowerCase().includes(especie) && especie !== "general") {
          const especieCap = especie.charAt(0).toUpperCase() + especie.slice(1);
          displayNombre = `${nombre} (${especieCap})`;
        }

        productsMap[groupKey] = {
          id: product.id,
          nombre: displayNombre,
          nombreOriginal: nombre,
          categoria: especie,
          descripcion: product.descripcion,
          imagen: null,
          variaciones: [],
          categoria_app: product.categoria_app,
          stock: product.Stock || 0,
        };

        if (Array.isArray(product.imagen) && product.imagen.length > 0) {
          productsMap[groupKey].imagen = product.imagen[0].url;
        } else {
          productsMap[groupKey].imagen = product.imagen;
        }
      }

      // 4. PROCESAR VARIACIÓN
      const precio = parseFloat(product.precio);
      if (isNaN(precio) || precio === 0) return;

      let key = "";
      let value = "";

      if (product.peso) {
        key = "Peso";
        value = product.peso;
      } else if (product.talla) {
        key = "Talla";
        value = product.talla;
      } else {
        key = "Opción";
        value = "Única";
      }

      const existeVar = productsMap[groupKey].variaciones.find(
        (v) => v.value === value
      );

      if (!existeVar && value) {
        productsMap[groupKey].variaciones.push({
          key: key,
          value: value,
          precio: precio,
        });
      }
    });
  } catch (err) {
    throw new Error(`Error procesando los datos: ${err.message}`);
  }

  return Object.values(productsMap);
};

// --- EL PROVIDER ---
export const ProductProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [alimentos, setAlimentos] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  const [higiene, setHigiene] = useState([]);
  const [venenos, setVenenos] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  useEffect(() => {
    const fetchTable = async (tableName) => {
      let allRecords = [];
      let offset = null;
      const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        tableName
      )}`;
      const params = new URLSearchParams({ pageSize: "100", view: "APIView" });

      try {
        do {
          if (offset) params.set("offset", offset);
          else params.delete("offset");

          const response = await fetch(`${baseUrl}?${params.toString()}`, {
            headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
          });

          if (!response.ok)
            throw new Error(
              `Error en Tabla ${tableName}: ${response.statusText}`
            );

          const jsonData = await response.json();
          allRecords.push(...jsonData.records);
          offset = jsonData.offset;
        } while (offset);
      } catch (err) {
        console.error(err);
        throw err;
      }

      // =================================================================
      // ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE!
      // Mapeamos tu columna 'id' a la propiedad 'nombre' explícitamente.
      // =================================================================
      return allRecords.map((record) => ({
        ...record.fields,

        // 1. Aquí forzamos que el 'nombre' sea lo que hay en tu columna 'id'
        nombre: record.fields.id,

        // 2. Mantenemos el ID del sistema aparte por si acaso
        systemId: record.id,
        id: record.id, // Necesario para React keys

        categoria_app: tableName,
      }));
    };

    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(TABLE_NAMES.map(fetchTable));
        const allProductsRaw = results.flat();

        if (allProductsRaw.length === 0)
          throw new Error("No hay productos en Airtable.");

        const allProducts = processAirtableData(allProductsRaw);

        setAlimentos(
          allProducts.filter((p) => p.categoria_app === "Alimentos")
        );
        setAccesorios(
          allProducts.filter((p) => p.categoria_app === "Accesorios")
        );
        setHigiene(
          allProducts.filter(
            (p) =>
              p.categoria_app === "Higiene" || p.categoria_app === "Aigiene"
          )
        );
        setVenenos(allProducts.filter((p) => p.categoria_app === "Venenos"));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const value = {
    loading,
    error,
    alimentos,
    accesorios,
    higiene,
    venenos,
    selectedProduct,
    openModal,
    closeModal,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
