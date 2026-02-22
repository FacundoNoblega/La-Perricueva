// src/context/ProductContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
// Importamos tu nueva conexión a Supabase (Asegurate de que la ruta sea correcta)
import { supabase } from "../lib/supabase"; 

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

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
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Le pedimos TODO a la tabla 'products' de una sola vez
        const { data: allProducts, error: supabaseError } = await supabase
          .from("products")
          .select("*");

        if (supabaseError) throw new Error(supabaseError.message);
        if (!allProducts || allProducts.length === 0) {
          throw new Error("No hay productos cargados en Supabase aún.");
        }

        // Formateamos los datos para que tu página los entienda sin chistar
        const formattedProducts = allProducts.map((p) => {
          // Nos aseguramos de que las variaciones sean un array (por si vienen vacías o mal guardadas)
          let parsedVariaciones = [];
          if (Array.isArray(p.variaciones)) {
            parsedVariaciones = p.variaciones;
          } else if (typeof p.variaciones === 'string') {
            try { parsedVariaciones = JSON.parse(p.variaciones); } catch (e) { }
          }

          return {
            id: p.id,
            nombre: p.nombre,
            marca: p.marca || "",
            categoria: p.categoria || "General",
            categoria_app: p.categoria || "General", // Usamos la misma categoría
            descripcion: p.descripcion || "",
            imagen: p.imagen_url || "/img/default.jpg", // Tu foto de Supabase
            variaciones: parsedVariaciones, // Acá ya vienen los tamaños y precios armaditos
          };
        });

        // Repartimos los productos en sus cajas correspondientes
        setAlimentos(formattedProducts.filter((p) => p.categoria_app.toLowerCase() === "alimentos"));
        setAccesorios(formattedProducts.filter((p) => p.categoria_app.toLowerCase() === "accesorios"));
        setHigiene(formattedProducts.filter((p) => p.categoria_app.toLowerCase() === "higiene"));
        setVenenos(formattedProducts.filter((p) => p.categoria_app.toLowerCase() === "venenos"));

      } catch (err) {
        console.error("Error al cargar desde Supabase:", err);
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