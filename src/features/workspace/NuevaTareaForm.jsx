"use client"

import { useState, useEffect, useContext } from "react"
import { X } from 'lucide-react'
import axios from "axios"
import { config } from "../../utils/config"
import { AuthContext } from "../../components/auth/AuthContext"

// Definir animaciones
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(20px); opacity: 0; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-fadeOut {
    animation: fadeOut 0.3s ease-out forwards;
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease-out forwards;
  }
  
  .animate-slideOut {
    animation: slideOut 0.3s ease-out forwards;
  }
`

export const NuevaTareaForm = ({ onClose, onSuccess ,addToast }) => {
  const [proyectos, setProyectos] = useState([])
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha_limite: "",
    estado: "",
    proyecto_id: "",
  })
  const { user } = useContext(AuthContext)

  const [loading, setLoading] = useState(false)
  const [loadingProyectos, setLoadingProyectos] = useState(false)
  const [error, setError] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {

    const fetchProyectos = async () => {
      setLoadingProyectos(true)
      try {
        const response = await axios.get(`${config.BASE_URL}/proyectos`, {
          headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
        })
        setProyectos(response.data.proyectos || [])
      } catch (error) {
        console.error("Error al obtener proyectos:", error.response?.data || error.message)
      } finally {
        setLoadingProyectos(false)
      }
    }

    fetchProyectos()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose && onClose()
    }, 300)
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!user) {
    setError("No hay usuario autenticado");
    console.error("Error: No hay usuario autenticado");
    setLoading(false);
    return;
  }

  const tareaData = { ...formData, usuario_id: user.id };

  try {
    const response = await axios.post(`${config.BASE_URL}/tareas`, tareaData, {
      headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
    });

    if (response.status === 201 || response.status === 200) {
      onSuccess && onSuccess(response.data);
      addToast("Tarea creada correctamente", "success");
      handleClose();
    }
  } catch (error) {
    
    setError(error.response?.data?.message || "Error al crear la tarea");

    console.error("Error al crear tarea:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <>
      <style>{animationStyles}</style>
      <div 
        className={`fixed inset-0 bg-gradient-to-br from-gray-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ${
          isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
      >
        <div 
          className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${
            isClosing ? 'animate-slideOut' : 'animate-slideIn'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Nueva Tarea</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la tarea *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa el nombre de la tarea"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe la tarea"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
                <input
                  type="date"
                  name="fecha_limite"
                  value={formData.fecha_limite}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un estado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                <select
                  name="proyecto_id"
                  value={formData.proyecto_id}
                  onChange={handleChange}
          
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un proyecto</option>
                  {loadingProyectos ? (
                    <option disabled>Cargando proyectos...</option>
                  ) : (
                    proyectos.map((proyecto) => (
                      <option key={proyecto.id} value={proyecto.id}>
                        {proyecto.nombre}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white !bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? "Creando..." : "Crear Tarea"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
