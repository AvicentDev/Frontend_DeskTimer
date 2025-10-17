"use client"

import { FolderPlus, CheckSquare } from "lucide-react"

export const QuickActions = ({ onNuevoProyecto, onNuevaTarea, onConfiguracion }) => (
  <div className="border-t border-gray-200 p-6">
    <h3 className="font-medium text-gray-700 mb-4">Acciones rápidas</h3>
    <div className="grid md:grid-cols-2 gap-3 ">
      <button
        className="flex items-center justify-center text-sm text-gray-700 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50"
        onClick={onNuevoProyecto}
      >
        <FolderPlus size={16} className="mr-2" />
        Nuevo proyecto
      </button>
      <button
        className="flex items-center justify-center text-sm text-gray-700 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50"
        onClick={onNuevaTarea}
      >
        <CheckSquare size={16} className="mr-2" />
        Nueva tarea
      </button>
     
    </div>
  </div>
)

