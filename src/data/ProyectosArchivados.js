import axios from "axios";
import { config } from "../utils/config";

// Ejemplo: Comprueba que la URL de proyectos archivados sea distinta
export const getProyectosArchivados = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/proyectos_archivados`, {
        headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los proyectos archivados:', error.response?.data || error.message);
      throw error;
    }
  };
  