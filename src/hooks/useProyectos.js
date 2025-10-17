import { useState, useEffect } from "react";
import { config } from "../utils/config";

const useProyectos = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/proyectos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.AUTH_TOKEN}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data.proyectos) {
        setProjects(data.proyectos); // Asegurar que accedemos a la lista de proyectos
      } else {
        setProjects([]);  
      }
    } catch (err) {
      console.error("Error al obtener los proyectos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, refreshProjects: fetchProjects };
};

export default useProyectos;
