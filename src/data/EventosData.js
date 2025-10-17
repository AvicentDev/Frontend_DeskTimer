import axios from 'axios';
import { config } from '../utils/config';

export const fetchCalendarEvents = async () => {
  try {
    const response = await axios.get(`${config.BASE_URL}/entrada_tiempo`, {
      headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
    });
    return response.data;   
    
  } catch (error) {
    console.error('Error al obtener los eventos:', error.response?.data || error.message);
    throw error;
  }
};
