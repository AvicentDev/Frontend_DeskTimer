import axios from 'axios';
import { config } from '../utils/config';
 // Asegúrate de que tienes tu configuración de URL base y token

export const getSolicitudes = async () => {
  try {
    // Hacemos una solicitud GET a la API de solicitudes
    const response = await axios.get(`${config.BASE_URL}/solicitudes`, {
      headers: {
        Authorization: `Bearer ${config.AUTH_TOKEN}`,  
      },
    });
    return response.data; 
    
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error.response?.data || error.message);
    throw error;  
  }
};
