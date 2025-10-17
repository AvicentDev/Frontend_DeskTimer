import axios from 'axios';
import { config } from '../utils/config';

export const getProjects = async(cliente_id) => {
    
    try {
        const response = await axios.get(`${config.BASE_URL}/clientes/proyectoscliente/${cliente_id}`, {
          headers: {
            Authorization: `Bearer ${config.AUTH_TOKEN}`,            
          },
        });
        
    
        return response.data;
        
      } catch (error) {
        console.error('Error al obtener los clientes:', error.response?.data || error.message);
        throw error;
      }
    
};
