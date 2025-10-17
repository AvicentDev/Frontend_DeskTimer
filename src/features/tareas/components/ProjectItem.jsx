// ProjectItem.jsx
import { useState } from "react"
import TaskList from "./TaskList"
import { ChevronDown, ChevronUp, FolderOpen } from "lucide-react"

const ProjectItem = ({ project, tasks, onSelectTask, onArchiveTask, onRestoreTask, onDeleteTask }) => {
  const [isOpen, setIsOpen] = useState(true)

  // Filtra las tareas que pertenecen a este proyecto
  const projectTasks = tasks.filter(
    (task) => Number(task.proyecto_id) === project.id
  )

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div className="mb-8 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
      {/* Encabezado del proyecto */}
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={toggleOpen}>
        <button
          className="btn-icon p-1.5 rounded-full hover:bg-gray-100 transition"
          aria-label={isOpen ? "Cerrar proyecto" : "Abrir proyecto"}
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center">
          <FolderOpen className="h-3 w-3" />
        </div>

        <h2 className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
          {project.nombre || "Sin proyecto"}
        </h2>
      </div>

      {/* Contenido colapsable: descripción y tareas */}
      {isOpen && (
        <div className="pl-14 pr-6 pb-5">
          {project.descripcion && (
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              {project.descripcion}
            </p>
          )}

          <TaskList 
            tasks={projectTasks} 
            onSelect={onSelectTask} 
            onArchiveTask={onArchiveTask} 
            onRestoreTask={onRestoreTask}
            onDeleteTask={onDeleteTask}  // <-- Pásalo aquí
          />
        </div>
      )}
    </div>
  )
}

export default ProjectItem
