"use client";

import { useState, useContext } from "react";
import { Archive, ChevronRight, RotateCcw, Trash2 } from "lucide-react";
import { AuthContext } from "../../../components/auth/AuthContext";
import { config } from "../../../utils/config";
import axios from "axios";

const TaskHeader = ({ task, onArchiveTask, onRestoreTask, onDeleteTask }) => {
  const { user } = useContext(AuthContext);
  const isArchived = task.estado === "archivado";

  // El checkbox se marca si el status de la tarea es "completed"
  const [isCompleted, setIsCompleted] = useState(task.status === "completed");
  // Controla la visualización de la opción de archivar/restaurar/eliminar
  const [showArchiveOption, setShowArchiveOption] = useState(false);

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    // Permitir marcar y desmarcar en cualquier caso
    const newState = !isCompleted;
    setIsCompleted(newState);
    setShowArchiveOption(newState);
  };

  const handleArchive = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Detiene el evento para que no abra el sidebar
    if (typeof onArchiveTask === "function") {
      onArchiveTask(task.id);
    }
  };

  const handleRestore = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.BASE_URL}/tareas_archivadas/${task.id}/restaurar`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );

      if (typeof onRestoreTask === "function") {
        onRestoreTask(task.id);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error en la respuesta del servidor:", error.response.data);
      } else {
        console.error("Error al enviar la petición:", error.message);
      }
    }
  };

  // Función para eliminar la tarea (solo se usará en tareas archivadas)
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onDeleteTask === "function") {
      onDeleteTask(task.id);
    } else {
      console.warn("onDeleteTask no está definido o no es una función");
    }
  };
  

  return (
    <div className="relative">
      <div className="flex items-center py-3 px-4">
        <div className="flex-shrink-0 mr-3">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={isCompleted}
            onChange={handleCheckboxClick}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              (isCompleted || isArchived)
                ? "line-through text-gray-500"
                : "text-gray-900"
            }`}
          >
            {task.nombre}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      {showArchiveOption && (
        <div className="absolute left-0 right-0 mt-1 bg-white shadow-md rounded-md p-2 z-10 border border-gray-200">
          {isArchived ? (
            <>
              {/* Opción para restaurar tarea */}
              <button
                type="button"
                className="w-full flex items-center justify-start text-gray-700 hover:text-gray-900"
                onClick={handleRestore}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurar tarea
              </button>
              {/* Botón para eliminar tarea (solo en archivadas) */}
              <button
                type="button"
                className="mt-1 w-full flex items-center justify-start text-red-600 hover:text-red-800"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar tarea
              </button>
            </>
          ) : (
            // Si la tarea no está archivada, mostrar opción de archivar
            <button
              type="button"
              className="w-full flex items-center justify-start text-gray-700 hover:text-gray-900"
              onClick={handleArchive}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archivar tarea
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskHeader;
