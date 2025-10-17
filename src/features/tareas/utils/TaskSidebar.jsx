"use client"
import { useState, useEffect } from "react"
import { X, Save, Trash2, Calendar, CheckCircle, Clock, AlertCircle, Briefcase, User, Loader2 } from "lucide-react"
import useClientes from "../../../hooks/useClientes"
import Toast from "../utils/Toast"

const TaskSidebar = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
  const [editedTask, setEditedTask] = useState(task || {})
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { clientes, loading, error } = useClientes()
  // Estado para las notificaciones toast
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (task) {
      setEditedTask(task)
      setIsEditing(false)
    }
  }, [task])

  if (!task) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    onUpdate(editedTask)
    setIsEditing(false)
    // Mostrar notificación de éxito
    setToast({
      type: "success",
      message: `Tarea "${editedTask.nombre}" actualizada correctamente`,
    })
  }

  const handleDelete = () => {
    const taskName = task.nombre
    onDelete(task.id)
    setShowDeleteConfirm(false)
    onClose()
    // Mostrar notificación de éxito
    setToast({
      type: "success",
      message: `Tarea "${taskName}" eliminada correctamente`,
    })
  }

  // Buscar el cliente usando el cliente_id del proyecto
  const cliente =
    task.proyecto && !loading && !error && Array.isArray(clientes)
      ? clientes.find((c) => c.id === task.proyecto.cliente_id)
      : null

  const renderEstado = (estado) => {
    switch (estado) {
      case "finalizado":
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-emerald-700">Completada</span>
          </div>
        )
      case "en_proceso":
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-amber-700">En progreso</span>
          </div>
        )
      case "pendiente":
        return (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            <span className="text-rose-700">Pendiente</span>
          </div>
        )
        case "archivado":
        return (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-800" />
            <span className="text-blue-800">Archivado</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-300" />
            <span className="text-gray-700">Desconocido</span>
          </div>
        )
    }
  }

  const renderClienteInfo = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Cliente</p>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              <span className="text-sm text-gray-500">Cargando...</span>
            </div>
          </div>
        </div>
      )
    }
    if (error) {
      return (
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Cliente</p>
            <p className="text-sm text-rose-500">Error al cargar cliente</p>
          </div>
        </div>
      )
    }
    if (cliente) {
      return (
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Cliente</p>
            <p className="text-sm text-gray-800">{cliente.nombre}</p>
          </div>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-3">
        <User className="h-5 w-5 text-gray-400" />
        <div>
          <p className="text-xs font-medium text-gray-500 mb-0.5">Cliente</p>
          <p className="text-sm text-gray-500">No disponible</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Detalles de la tarea</h2>
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isEditing ? (
            <div className="p-6 space-y-5">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={editedTask.nombre || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={editedTask.descripcion || ""}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="fecha_limite" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha límite
                </label>
                <input
                  id="fecha_limite"
                  name="fecha_limite"
                  type="date"
                  value={editedTask.fecha_limite ? new Date(editedTask.fecha_limite).toLocaleDateString("sv-SE") : ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={editedTask.estado || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En progreso</option>
                  <option value="finalizado">Completada</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">{task.nombre}</h3>
              <div className="mb-6">
                <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{task.descripcion}</p>
              </div>
              <div className="space-y-4 border-t border-gray-100 pt-4">
                {task.fecha_limite && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-0.5">Fecha límite</p>
                      <p className="text-sm text-gray-800">
                        {new Date(task.fecha_limite).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {task.estado && (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 text-gray-400 flex items-center justify-center">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          task.estado === "finalizado"
                            ? "bg-emerald-500"
                            : task.estado === "en_proceso"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-0.5">Estado</p>
                      <div>{renderEstado(task.estado)}</div>
                    </div>
                  </div>
                )}
                {task.proyecto && (
                  <>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Proyecto</p>
                        <p className="text-sm text-gray-800">{task.proyecto.nombre}</p>
                      </div>
                    </div>
                    {renderClienteInfo()}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          {isEditing ? (
            <>
              <button
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center text-sm font-medium"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md !bg-blue-600 text-white  hover:bg-blue-700  transition-colors text-sm font-medium"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </button>
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center text-sm font-medium"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
                Eliminar
              </button>
              <button
                className="px-4 py-2 !bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>
            </>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="mb-5">
              <h3 className="text-lg font-medium text-gray-900 mb-2">¿Estás seguro?</h3>
              <p className="text-gray-500 text-sm">
                Esta acción no se puede deshacer. Esto eliminará permanentemente la tarea.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md !bg-blue-600 text-white  hover:bg-blue-700  transition-colors text-sm font-medium"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 !bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de notificación */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}

export default TaskSidebar

