import axios from 'axios';
import { config } from '../utils/config';

export const getMiembros = async () => {
  try {
    const response = await axios.get(`${config.BASE_URL}/miembros`, {
      headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
