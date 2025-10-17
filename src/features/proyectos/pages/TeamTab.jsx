import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmModal from "../utils/ConfirmModal"; // Ajusta la ruta según tu estructura

const TeamTab = ({ project, onAddMember, onRemoveMember }) => {
  const [miembroAEliminar, setMiembroAEliminar] = useState(null);

  const handleDeleteClick = (member) => {
    setMiembroAEliminar(member);
  };

  const confirmDelete = () => {
    if (miembroAEliminar) {
      onRemoveMember(miembroAEliminar.id);
      setMiembroAEliminar(null);
    }
  };

  const cancelDelete = () => {
    setMiembroAEliminar(null);
  };

  return (
    <div className="space-y-6">
      {/* Sección de Miembros */}
      <div className="p-6 bg-white rounded-lg shadow border-l-4 border-teal-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Miembros del Proyecto
        </h3>
        {project.miembros && project.miembros.length > 0 ? (
          <ul className="space-y-2">
            {project.miembros.map((m) => (
              <li
                key={m.id}
                className="p-4 bg-gray-50 rounded-md shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 font-medium">{m.nombre}</p>
                  <p className="text-gray-600">Rol: {m.rol || "—"}</p>
                </div>
                {/* Botón de eliminar */}
                <button
                  className="text-red-500 hover:text-red-700 p-2 rounded transition"
                  onClick={() => handleDeleteClick(m)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No hay miembros asignados.</p>
        )}
        <div className="mt-4">
          <button
            className="w-full flex items-center justify-center !bg-blue-600 text-white  hover:bg-blue-700   font-semibold py-2 px-4 rounded transition-colors duration-200"
            onClick={onAddMember}
          >
            Añadir Miembro
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {miembroAEliminar && (
        <ConfirmModal
          message={`¿Eliminar a ${miembroAEliminar.nombre}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default TeamTab;
