import axios from "axios";
import { config } from "../utils/config";

export const getTareasArchivadas = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/tareas_archivadas`, {
        headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los tareas archivados:', error.response?.data || error.message);
      throw error;
    }
  };
  