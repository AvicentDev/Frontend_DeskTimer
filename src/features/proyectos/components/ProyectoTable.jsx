"use client"

import { Play, Pause } from "lucide-react"
import { useTimer } from "../../../components/auth/TimerContext"

const ProjectTable = ({
  proyectos,
  selectedProjects,
  allSelected,
  onSelectAll,
  onSelectProject,
  formatTiempoEstimado,
  onProjectClick,
  refreshProject, // callback para actualizar el proyecto al detener el timer
}) => {
  const { isTimerRunning, activeProject, startTimer, stopTimer } = useTimer()

  const handleStartTimer = (proyecto) => {
    if (activeProject?.id === proyecto.id && isTimerRunning) {
      // detenemos el timer y refrescamos con la nueva entrada
      stopTimer("", (newEntry) => {
        if (refreshProject) refreshProject(proyecto.id, newEntry)
      })
    } else {
      // iniciamos un nuevo timer
      startTimer(proyecto)
    }
  }

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="py-3 px-4 w-24">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={e => onSelectAll(e.target.checked)}
                />
                <span className="sr-only">Acciones</span>
              </div>
            </th>
            <th className="py-3 px-4 text-left">Proyecto</th>
            <th className="py-3 px-4 text-left">Cliente</th>
            <th className="py-3 px-4 text-left">Fecha de Entrega</th>
            <th className="py-3 px-4 text-left">Tiempo Estimado</th>
            <th className="py-3 px-4 text-left">Team</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map(proj => {
            const isChecked = selectedProjects.includes(proj.id)
            const isArchived = proj.estado === "archivado"
            const isActive   = activeProject?.id === proj.id && isTimerRunning

            return (
              <tr
                key={proj.id}
                className={`border-b border-gray-200 ${
                  isArchived ? "opacity-50" : "hover:bg-gray-50"
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onSelectProject(proj)}
                      className="h-3 w-3"
                    />
                    {!isArchived && (
                      <button
                        onClick={() => handleStartTimer(proj)}
                        className={`transition-colors rounded-full p-2 ${
                          isActive
                            ? "text-red-500 hover:text-red-700"
                            : "text-gray-500 hover:text-blue-600"
                        }`}
                      >
                        {isActive ? <Pause size={12}/> : <Play size={12}/>}
                      </button>
                    )}
                  </div>
                </td>

                <td
                  className={`py-3 px-4 font-medium ${
                    isArchived
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 cursor-pointer hover:underline"
                  }`}
                  onClick={() => !isArchived && onProjectClick?.(proj)}
                >
                  {proj.nombre || "—"}
                </td>

                <td className="py-3 px-4">
                  {proj.cliente?.nombre || "—"}
                </td>

                <td className="py-3 px-4">
                  {proj.fecha_entrega || "No definida"}
                </td>

                <td className="py-3 px-4">
                  {formatTiempoEstimado(proj.tiempo_estimado)}
                </td>

                <td className="py-3 px-4">
                  {proj.miembros?.length
                    ? proj.miembros.map(m => m.nombre).join(", ")
                    : "—"
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectTable
