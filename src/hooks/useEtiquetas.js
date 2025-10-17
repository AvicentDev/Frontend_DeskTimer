// src/hooks/useEtiquetas.js
import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../utils/config";

const useEtiquetas = () => {
  const [etiquetas, setEtiquetas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEtiquetas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.BASE_URL}/etiqueta`,
        {
          headers: {
            Authorization: `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );
      // Normalizamos el array
      const lista = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.etiquetas)
          ? response.data.etiquetas
          : [];
      setEtiquetas(lista);
    } catch (error) {
      console.error("Error al obtener etiquetas:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEtiquetas();
  }, []);

  return {
    etiquetas,
    loading,
    refreshEtiquetas: fetchEtiquetas,
  };
};

export default useEtiquetas;
