// ProjectList.jsx
import ProjectItem from "./ProjectItem"

const ProjectList = ({ projects, tasks, onSelectTask, onArchiveTask, onRestoreTask, onDeleteTask }) => {
  if (!projects || projects.length === 0) {
    return <p className="text-gray-500 py-4">No hay proyectos disponibles.</p>
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => {
        // Filtra solo las tareas pertenecientes a este proyecto
        const tasksForProject = tasks.filter((task) => task.proyecto_id === project.id)
        
        // Si no hay tareas para este proyecto (después del filtrado), no renderizar nada
        if (tasksForProject.length === 0) {
          return null
        }

        return (
          <ProjectItem
            key={project.id}
            project={project}
            tasks={tasksForProject}
            onSelectTask={onSelectTask}
            onArchiveTask={onArchiveTask}
            onRestoreTask={onRestoreTask}
            onDeleteTask={onDeleteTask}  // <-- Pásalo aquí
          />
        )
      })}
    </div>
  )
}

export default ProjectList
