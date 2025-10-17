"use client"

import { useState } from "react"
import axios from "axios"
import { config } from "../../../utils/config"
import useProyectos from "../../../hooks/useProyectos"
import { X, Clock, Calendar, FileText, MessageSquare, Loader2 } from "lucide-react"

export default function TimeRequestModal({ isOpen, onClose }) {
  const { projects, loading: proyectosLoading, error: proyectosError } = useProyectos()
  const [proyectoId, setProyectoId] = useState("")
  const [tiempoInicio, setTiempoInicio] = useState("")
  const [tiempoFin, setTiempoFin] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [comentario, setComentario] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!proyectoId || !tiempoInicio || !tiempoFin) {
      setError("Debes seleccionar un proyecto y rellenar las fechas")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${config.BASE_URL}/solicitudes`,
        {
          proyecto_id: proyectoId,
          tiempo_inicio: tiempoInicio,
          tiempo_fin: tiempoFin,
          descripcion: descripcion || null,
          comentario: comentario || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      )

      // Mostrar mensaje de éxito
      setSuccess("✅ Solicitud enviada correctamente")
      // Cerrar modal tras 1.5 segundos
      setTimeout(() => {
        setSuccess("")
        onClose()
      }, 1500)

    } catch (err) {
      console.error("Error al enviar solicitud:", err)
      setError(err.response?.data?.error || "Error al enviar la solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Crear Solicitud de Tiempo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-5">
            {/* Mensaje de éxito */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Errores generales */}
            {(error || proyectosError) && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error || `Error proyectos: ${proyectosError}`}
              </div>
            )}

            {/* Select de Proyectos */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-gray-500" />
                Proyecto
              </label>
              {proyectosLoading ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando proyectos...
                </div>
              ) : (
                <select
                  value={proyectoId}
                  onChange={(e) => setProyectoId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                >
                  <option value="">-- Selecciona proyecto --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Fecha y hora inicio */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 text-gray-500" />
                Fecha y hora inicio
              </label>
              <input
                type="datetime-local"
                value={tiempoInicio}
                onChange={(e) => setTiempoInicio(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Fecha y hora fin */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 text-gray-500" />
                Fecha y hora fin
              </label>
              <input
                type="datetime-local"
                value={tiempoFin}
                onChange={(e) => setTiempoFin(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-gray-500" />
                Descripción (opcional)
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
                placeholder="Describe brevemente tu solicitud..."
              />
            </div>

            {/* Comentario */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                Comentario (opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
                placeholder="Añade cualquier comentario adicional..."
              />
            </div>
          </div>

          <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || proyectosLoading}
              className={`px-5 py-2.5 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all flex items-center gap-2 ${
                isLoading || proyectosLoading
                  ? "!bg-blue-400 cursor-not-allowed"
                  : "!bg-blue-600 hover:bg-teal-700 focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar solicitud"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}