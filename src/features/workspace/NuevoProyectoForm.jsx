"use client"

import { useState, useEffect } from "react"
import { X } from 'lucide-react'
import axios from "axios"
import { config } from "../../utils/config"
import useClientes from '../../hooks/useClientes'

const animationStyles = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes slideOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }
  .animate-fadeIn  { animation: fadeIn 0.3s ease-out forwards; }
  .animate-fadeOut { animation: fadeOut 0.3s ease-out forwards; }
  .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
  .animate-slideOut{ animation: slideOut 0.3s ease-out forwards; }
`

export const NuevoProyectoForm = ({ onClose, onSuccess, addToast }) => {
  const { clientes } = useClientes()

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    horasEstimadas: "",
    fechaEntrega: "",
    estado: "pendiente",
    prioridad: "media",
    cliente: "",
    color: "#2196F3"
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose && onClose()
    }, 300)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const horas = parseInt(formData.horasEstimadas)
    if (isNaN(horas) || horas < 0) {
      setError("Introduce un número válido de horas")
      setLoading(false)
      return
    }

    const payload = {
      nombre:         formData.nombre,
      descripcion:    formData.descripcion,
      tiempo_estimado: horas,
      fecha_entrega:  formData.fechaEntrega,
      estado:         formData.estado,
      prioridad:      formData.prioridad,
      cliente_id:     formData.cliente,
      color:          formData.color
    }

    try {
      const res = await axios.post(
        `${config.BASE_URL}/proyectos`,
        payload,
        { headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` } }
      )

      if (res.status === 200 || res.status === 201) {
        onSuccess && onSuccess(res.data)
        addToast && addToast("Proyecto creado exitosamente", "success")
        handleClose()
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error al crear el proyecto"
      setError(msg)
      addToast && addToast(msg, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

  const presetColors = ['#2196F3', '#4CAF50', '#F44336', '#FFC107', '#9C27B0', '#FF9800', '#795548', '#607D8B']

  return (
    <>
      <style>{animationStyles}</style>
      <div className={`fixed inset-0 bg-gradient-to-br from-gray-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
        <div className={`bg-white rounded-lg shadow-xl w-full max-w-md transform ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Nuevo Proyecto</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del proyecto *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horas estimadas *</label>
                  <input type="number" name="horasEstimadas" value={formData.horasEstimadas} onChange={handleChange} min="0" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: 80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega *</label>
                  <input type="date" name="fechaEntrega" value={formData.fechaEntrega} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select name="prioridad" value={formData.prioridad} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select name="cliente" value={formData.cliente} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccione un cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="color" className="block mb-2 text-sm font-medium text-gray-700">Color del Proyecto</label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded border border-gray-300 relative">
                    <input type="color" id="color" name="color" value={formData.color} onChange={handleChange} className="w-full h-full opacity-0 cursor-pointer absolute top-0 left-0" />
                    <div className="absolute inset-0 rounded" style={{ backgroundColor: formData.color }} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {presetColors.map(col => (
                      <button key={col} type="button" onClick={() => setFormData(prev => ({ ...prev, color: col }))} className={`w-10 h-10 rounded border ${formData.color === col ? 'ring-2 ring-offset-1 ring-blue-500' : 'border-gray-300 hover:border-gray-400'}`} style={{ backgroundColor: col }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={loading} className={`px-4 py-2 text-sm font-medium text-white !bg-blue-600 rounded-md hover:bg-blue-700 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
                {loading ? "Creando..." : "Crear Proyecto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
