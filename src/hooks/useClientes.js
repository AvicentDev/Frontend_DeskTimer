import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '.././utils/config';

const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/clientes`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.AUTH_TOKEN}`,
          },
        });
        setClientes(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  return { clientes, loading, error };
};

export default useClientes;
