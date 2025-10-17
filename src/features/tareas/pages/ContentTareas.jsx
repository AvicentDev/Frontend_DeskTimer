"use client"
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import useProyectos from "../../../hooks/useProyectos"
import { getTareas } from "../../../data/TareasData"
import ProjectList from "../components/ProjectList"
import { ChevronDown, ChevronUp, FolderOpen, PlusCircle } from "lucide-react"
import FormularioTarea from "../components/FormularioTarea"
import useForm from "../../../hooks/useForm"
import { config } from "../../../utils/config"
import TaskSidebar from "../utils/TaskSidebar"
import { ToastContainer } from "../utils/Toast"
import FilterButton from "../utils/FilterButton"
import { getTareasArchivadas } from "../../../data/TareasArchivadas"
import { AuthContext } from "../../../components/auth/AuthContext"
import TaskList from "../components/TaskList"

const ContentTareas = () => {
  const { projects, loading, error } = useProyectos()

  // ESTADO DE TAREAS
  const [tasks, setTasks] = useState([])
  const [loadingT, setLoadingT] = useState(true)
  const [errorT, setErrorT] = useState(null)
  const { user } = useContext(AuthContext)
  const [isOpenNoProject, setIsOpenNoProject] = useState(true);
  

  // ESTADO DE FILTROS
  const [filterOptions, setFilterOptions] = useState([
    { id: "all", label: "Mostrar todos", selected: true },
    { id: "pending", label: "Pendiente", selected: false },
    { id: "in_progress", label: "En proceso", selected: false },
    { id: "completed", label: "Finalizado", selected: false },
    { id: "archived", label: "Archivadas", selected: false },
  ]);
  

  // ESTADOS PARA FORMULARIO Y SIDEBAR
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // ESTADO PARA NOTIFICACIONES TOAST
  const [toasts, setToasts] = useState([])

  // HOOK PARA MANEJAR EL FORMULARIO
  const { values, handleChange, resetForm } = useForm({
    nombre: "",
    descripcion: "",
    fecha_limite: "",
    estado: "",
    usuario_id: user.id,
    proyecto_id: "",
  })

  // 1. Cuando cambia el filtro, decide si llamamos a "getTareas" o "getTareasArchivadas"
  useEffect(() => {
    let isMounted = true;
  
    const fetchTareas = async () => {
      setLoadingT(true);
      setErrorT(null);
  
      try {
        let data;
  
        // Verificar si el filtro seleccionado es "archived"
        const archivedSelected = filterOptions.find((f) => f.selected && f.id === "archived");
  
        if (archivedSelected) {
          data = await getTareasArchivadas(); // Obtiene solo tareas archivadas
        } else {
          data = await getTareas(); // Obtiene tareas activas
        }
  
        let filteredTasks = Array.isArray(data.tareas) ? data.tareas : [];
  
        // Filtrar por otros estados (pendiente, en proceso, finalizado)
        const selectedFilter = filterOptions.find(
          (f) => f.selected && !["all", "archived"].includes(f.id)
        );
        if (selectedFilter) {
          filteredTasks = filteredTasks.filter((task) => {
            switch (selectedFilter.id) {
              case "pending":
                return task.estado === "pendiente";
              case "in_progress":
                return task.estado === "en_proceso";
              case "completed":
                return task.estado === "finalizado";
              default:
                return true;
            }
          });
        }
  
        if (isMounted) {
          setTasks(filteredTasks);
        }
      } catch (err) {
        if (isMounted) setErrorT(err.message);
      } finally {
        if (isMounted) setLoadingT(false);
      }
    };
  
    fetchTareas();
  
    return () => {
      isMounted = false;
    };
  }, [filterOptions]);
  
  

  // 2. Funciones de notificaciones
  const addToast = (toast) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, ...toast }])
  }

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  // 3. Función para agregar tarea
  const handleAddTask = async (newTask) => {
    const newTaskConverted = { 
      ...newTask,
      proyecto_id: newTask.proyecto_id ? Number(newTask.proyecto_id) : null 
    };
    
  
    const tempTask = { ...newTaskConverted, id: Date.now() };
  
    // Actualización optimista
    setTasks((prevTasks) => [...prevTasks, tempTask]);
  
    try {
      const response = await axios.post(`${config.BASE_URL}/tareas`, newTaskConverted, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.AUTH_TOKEN}`,
        },
      });
  
      // Reemplaza la tarea temporal por la que retorna el servidor
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === tempTask.id ? response.data.tarea : task))
      );
  
      addToast({
        type: "success",
        message: `Tarea "${newTask.nombre}" creada correctamente`,
      });
    } catch (error) {
      console.error("Error al enviar la tarea:", error.response?.data || error.message);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== tempTask.id));
  
      addToast({
        type: "error",
        message: `Error al crear la tarea: ${error.response?.data?.message || error.message}`,
      });
    }
  
    resetForm();
    setIsAddModalOpen(false);
  };
  

  // 4. Funciones para seleccionar, actualizar, eliminar, archivar y restaurar tareas
  const handleSelectTask = (task) => {
    // Si la tarea está archivada, no se abre el sidebar
    if (task.estado === "archivado") return
    setSelectedTask(task)
    setIsSidebarOpen(true)
  }

  const handleUpdateTask = async (updatedTask) => {
    try {
      await axios.put(`${config.BASE_URL}/tareas/${updatedTask.id}`, updatedTask, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.AUTH_TOKEN}`,
        },
      })

      // Vuelve a cargar las tareas normales o archivadas según el filtro actual
      const archivedSelected = filterOptions.find((f) => f.id === "archived")?.selected
      if (archivedSelected) {
        const data = await getTareasArchivadas()
        setTasks(Array.isArray(data.tareas) ? data.tareas : [])
      } else {
        const data = await getTareas()
        setTasks(Array.isArray(data.tareas) ? data.tareas : [])
      }

      // Actualiza la tarea seleccionada en el sidebar (si sigue existiendo)
      const updatedTaskFromList = tasks.find((task) => task.id === updatedTask.id)
      setSelectedTask(updatedTaskFromList || null)
      setIsSidebarOpen(false)

      addToast({
        type: "success",
        message: `Tarea "${updatedTask.nombre}" actualizada correctamente`,
      })
    } catch (error) {
      console.error("Error al actualizar la tarea:", error.response?.data || error.message)
      addToast({
        type: "error",
        message: `Error al actualizar la tarea: ${error.response?.data?.message || error.message}`,
      })
    }
  }

  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find((task) => task.id === taskId)
    const taskName = taskToDelete ? taskToDelete.nombre : "La tarea"

    try {
      await axios.delete(`${config.BASE_URL}/tareas/${taskId}`, {
        headers: {
          Authorization: `Bearer ${config.AUTH_TOKEN}`,
        },
      })
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
      setSelectedTask(null)
      setIsSidebarOpen(false)

      addToast({
        type: "success",
        message: `Tarea "${taskName}" eliminada correctamente`,
      })
    } catch (error) {
      console.error("Error al eliminar la tarea:", error.response?.data || error.message)
      addToast({
        type: "error",
        message: `Error al eliminar la tarea: ${error.response?.data?.message || error.message}`,
      })
    }
  }

  const handleArchiveTask = async (taskId) => {
    try {
      await axios.post(
        `${config.BASE_URL}/tareas/${taskId}/archivar`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.AUTH_TOKEN}`,
          },
        },
      )
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))

      addToast({
        type: "success",
        message: "Tarea archivada correctamente",
      })
    } catch (error) {
      console.error("Error al archivar la tarea:", error.response?.data || error.message)
      addToast({
        type: "error",
        message: `Error al archivar la tarea: ${error.response?.data?.message || error.message}`,
      })
    }
  }

  const handleRestoreTask = async (taskId) => {
    try {
      const archivedSelected = filterOptions.find((f) => f.id === "archived")?.selected;
      const data = archivedSelected ? await getTareasArchivadas() : await getTareas();
      setTasks(Array.isArray(data.tareas) ? data.tareas : []);
      addToast({
        type: "success",
        message: "Tarea restaurada correctamente",
      });
    } catch (error) {
      console.error("Error al restaurar la tarea:", error.response?.data || error.message);
      addToast({
        type: "error",
        message: `Error al restaurar la tarea: ${error.response?.data?.message || error.message}`,
      });
    }
  };

  const handleDeleteArchivedTask = async (taskId) => {
    try {
  
      await axios.delete(`${config.BASE_URL}/tareas_archivadas/${taskId}`, {
        headers: {
          Authorization: `Bearer ${config.AUTH_TOKEN}`,
        },
      });
  
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
        return updatedTasks;
      });
  
      setSelectedTask(null);
      setIsSidebarOpen(false);
  
      addToast({
        type: "success",
        message: "Tarea eliminada correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar la tarea:", error.response?.data || error.message);
      addToast({
        type: "error",
        message: `Error al eliminar la tarea: ${error.response?.data?.message || error.message}`,
      });
    }
  };

  // 5. Renderizado final
  if (loading || loadingT) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || errorT) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error ? `Error al cargar proyectos: ${error}` : `Error al cargar tareas: ${errorT}`}
        </div>
      </div>
    )
  }

  // Dentro del render del componente ContentTareas

// Filtrar tareas según si tienen proyecto o no
const tasksWithProject = tasks.filter(task => task.proyecto_id);
const tasksWithoutProject = tasks.filter(task => !task.proyecto_id);

return (
  <div className="flex-1 p-8 overflow-visible relative">
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Tareas</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5 text-white" />
          Agregar Tarea
        </button>
      </div>

      {/* Filtro */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <FilterButton filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
      </div>

      {/* Lista de Proyectos y Tareas */}
      <div className="space-y-6">
        {tasks.length === 0 ? (
          <p className="text-gray-500 py-4">No hay tareas con este filtro.</p>
        ) : (
          <>
            {/* Tareas con proyecto */}
            {tasksWithProject.length > 0 && (
              <ProjectList
                projects={projects}
                tasks={tasksWithProject}
                onSelectTask={handleSelectTask}
                onArchiveTask={handleArchiveTask}
                onRestoreTask={handleRestoreTask}
                onDeleteTask={
                  filterOptions.find((f) => f.id === "archived" && f.selected)
                    ? handleDeleteArchivedTask
                    : handleDeleteTask
                }
              />
            )}

            {/* Tareas sin proyecto */}
            {/* Tareas sin proyecto */}
            {tasksWithoutProject.length > 0 && (
              <div className="mb-8 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
                {/* Encabezado (similar a ProjectItem) */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => setIsOpenNoProject(!isOpenNoProject)}
                >
                  <button
                    className="btn-icon p-1.5 rounded-full hover:bg-gray-100 transition"
                    aria-label={isOpenNoProject ? "Cerrar tareas sin proyecto" : "Abrir tareas sin proyecto"}
                  >
                    {isOpenNoProject ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center">
                    <FolderOpen className="h-3 w-3" />
                  </div>

                  <h2 className="line-through text-black font-medium hover:text-black transition-colors">
                    Tareas sin proyecto
                  </h2>

                </div>

                {/* Contenido colapsable */}
                {isOpenNoProject && (
                  <div className="pl-14 pr-6 pb-5">
                    <TaskList
                      tasks={tasksWithoutProject}
                      onSelect={handleSelectTask}
                      onArchiveTask={handleArchiveTask}
                      onRestoreTask={handleRestoreTask}
                      onDeleteTask={
                        filterOptions.find((f) => f.id === "archived" && f.selected)
                          ? handleDeleteArchivedTask
                          : handleDeleteTask
                      }
                    />
                  </div>
                )}
              </div>
            )}

          </>
        )}
      </div>
    </div>

    {/* Modal para agregar tarea */}
    {isAddModalOpen && (
      <FormularioTarea
        title="Agregar Tarea"
        proyectos={projects}
        values={values}
        handleChange={handleChange}
        onSubmit={handleAddTask}
        onClose={() => setIsAddModalOpen(false)}
      />
    )}

    {/* Sidebar para detalles/edición/eliminación */}
    <TaskSidebar
      task={selectedTask}
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      onUpdate={handleUpdateTask}
      onDelete={handleDeleteTask}
    />

    {/* Contenedor de notificaciones toast */}
    <ToastContainer toasts={toasts} removeToast={removeToast} />
  </div>
);

}

export default ContentTareas
