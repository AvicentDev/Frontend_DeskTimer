import axios from 'axios';
import { config } from '../utils/config';

export const getProyectos = async () => {
  try {
    const response = await axios.get(`${config.BASE_URL}/proyectos`, {
      headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
    });
    return response.data;
 
    
  } catch (error) {
    console.error('Error al obtener los proyectos:', error.response?.data || error.message);
    throw error;
  }
};


export const addProyecto = async (newProjectData, refreshProjects) => {
  try {
    const response = await axios.post(
      `${config.BASE_URL}/proyectos`,
      newProjectData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.AUTH_TOKEN}`,
        },
      }
    );
    // Actualiza la lista de proyectos
    refreshProjects();
    return response.data;
  } catch (error) {
    console.error(
      "Error al agregar el proyecto:",
      error.response?.data || error.message
    );
    throw error;
  }
};
