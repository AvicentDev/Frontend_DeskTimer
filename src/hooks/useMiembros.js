// hooks/useMiembros.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../utils/config';

export default function useMiembros() {
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMiembros() {
      try {
        setLoading(true);
        const response = await axios.get(`${config.BASE_URL}/miembros`, {
          headers: {
            Authorization: `Bearer ${config.AUTH_TOKEN}`
          }
        });
        
        setMiembros(response.data.miembros); // Asumiendo que tu backend responde { miembros: [...] }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMiembros();
  }, []);

  return { miembros, loading, error };
}
