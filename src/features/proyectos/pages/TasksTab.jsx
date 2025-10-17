import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { config } from "../../../utils/config";

const TasksTab = ({ project }) => {
  const [tareas, setTareas] = useState(project.tareas || []);
  const loaded = useRef(false); // Controla que solo cargue una vez

  const cargarTareas = async () => {
    if (loaded.current) return; // Evita recargas innecesarias

    loaded.current = true; // Marca como cargado
    try {
      const response = await axios.get(
        `${config.BASE_URL}/tareas/proyecto/${project.id}`,
        {
          headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
        }
      );

      // Solo actualiza si los datos cambiaron
      if (JSON.stringify(response.data.tareas) !== JSON.stringify(tareas)) {
        setTareas(response.data.tareas);
      }
    } catch (error) {
      console.error(
        "Error cargando tareas:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    cargarTareas();
  }, [project]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow border-l-4 border-indigo-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Listado de Tareas</h3>
        {tareas && tareas.length > 0 ? (
          <ul className="space-y-2">
            {tareas.map((task) => (
              <li key={task.id} className="p-4 bg-gray-50 rounded-md shadow-sm">
                <h4 className="font-semibold text-gray-700">{task.nombre}</h4>
                <p className="text-gray-600">{task.descripcion || "Sin descripción"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No hay tareas asignadas.</p>
        )}
      </div>
    </div>
  );
};

export default TasksTab;
