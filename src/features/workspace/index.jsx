"use client"

import { useEffect, useState } from "react"
import { WorkspaceHeader } from "./WorkspaceHeader"
import { WorkspaceCard } from "./WorkspaceCard"
import { Briefcase, CheckSquare } from "lucide-react"
import { QuickActions } from "./QuickActions"
import { NuevoProyectoForm } from "./NuevoProyectoForm"
import { NuevaTareaForm } from "./NuevaTareaForm"
import { ConfiguracionPanel } from "../../components/config/ConfiguracionPanel"
import axios from "axios"
import { config } from "../../utils/config"
import { ToastContainer } from "../tareas/utils/Toast" // Ajusta la ruta según tu estructura

export const WorkspaceContent = ({ setActiveItem }) => {
  // Estados para la cantidad de proyectos y tareas
  const [activeProjects, setActiveProjects] = useState(0)
  const [pendingTasks, setPendingTasks] = useState(0)

  // Estados para mostrar los modales
  const [showNuevoProyecto, setShowNuevoProyecto] = useState(false)
  const [showNuevaTarea, setShowNuevaTarea] = useState(false)
  const [showConfiguracion, setShowConfiguracion] = useState(false)

  // Estado para Toasts
  const [toasts, setToasts] = useState([])

  const addToast = (message, type) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/proyectos`, {
          headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
        })
        const data = response.data
        const allProjects = data.proyectos || []
        const enProceso = allProjects.filter((p) => p.estado === "en_proceso")
        setActiveProjects(enProceso.length)
      } catch (error) {
        console.error("Error al obtener proyectos:", error.response?.data || error.message)
      }
    }

    fetchProjects()
  }, [showNuevoProyecto]) // Refrescar cuando se crea un nuevo proyecto

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/tareas`, {
          headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
        })
        const data = response.data
        const pendientes = data.tareas.filter((t) => t.estado?.toLowerCase() === "pendiente")
        setPendingTasks(pendientes.length)
      } catch (error) {
        console.error("Error al obtener tareas:", error.response?.data || error.message)
      }
    }

    fetchTasks()
  }, [showNuevaTarea]) // Refrescar cuando se crea una nueva tarea

  // Manejadores para los botones de acciones rápidas
  const handleNuevoProyecto = () => {
    setShowNuevoProyecto(true)
  }

  const handleNuevaTarea = () => {
    setShowNuevaTarea(true)
  }

  const handleConfiguracion = () => {
    setShowConfiguracion(true)
  }

  // Manejador para cuando se crea un nuevo proyecto
  const handleProyectoCreado = (data) => {
    // Actualizar la lista de proyectos
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/proyectos`, {
          headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
        })
        const data = response.data
        const allProjects = data.proyectos || []
        const enProceso = allProjects.filter((p) => p.estado === "en_proceso")
        setActiveProjects(enProceso.length)
      } catch (error) {
        console.error("Error al obtener proyectos:", error.response?.data || error.message)
      }
    }

    fetchProjects()
  }

  // Manejador para cuando se crea una nueva tarea
  const handleTareaCreada = (data) => {
    // Actualizar la lista de tareas
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/tareas`, {
          headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
        })
        const data = response.data
        const pendientes = data.tareas.filter((t) => t.estado?.toLowerCase() === "pendiente")
        setPendingTasks(pendientes.length)
      } catch (error) {
        console.error("Error al obtener tareas:", error.response?.data || error.message)
      }
    }

    fetchTasks()
  }

  return (
    <div className="flex flex-col w-full h-full p-8">
      <div className="max-w-screen-xl mx-auto w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">WorkSpace</h1>

        <div className="bg-white rounded-lg shadow-md">
          <WorkspaceHeader />

          <div className="grid md:grid-cols-2 gap-4 p-6">
            <WorkspaceCard
              icon={<Briefcase size={22} className="text-purple-700 mr-3" />}
              title="Proyectos"
              description="Administra todos tus proyectos, crea nuevos y organiza tu equipo."
              status={`${activeProjects} proyectos activos`}
              onClick={() => setActiveItem("proyectos")}
            />

            <WorkspaceCard
              icon={<CheckSquare size={22} className="text-green-600 mr-3" />}
              title="Tareas"
              description="Visualiza, crea y asigna tareas. Establece prioridades y fechas límite."
              status={`${pendingTasks} tareas pendientes`}
              onClick={() => setActiveItem("tareas")}
            />
          </div>

          <QuickActions
            onNuevoProyecto={handleNuevoProyecto}
            onNuevaTarea={handleNuevaTarea}
            onConfiguracion={handleConfiguracion}
          />
        </div>
      </div>

      {/* Modales para las acciones rápidas */}
      {showNuevoProyecto && (
        <NuevoProyectoForm
          onClose={() => setShowNuevoProyecto(false)}
          onSuccess={handleProyectoCreado}
          addToast={addToast}
        />
      )}

      {showNuevaTarea && <NuevaTareaForm onClose={() => setShowNuevaTarea(false)} onSuccess={handleTareaCreada} addToast={addToast} />}


      {/* Componente ToastContainer para mostrar las notificaciones */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
