"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import useClientes from "../../../hooks/useClientes"

const animationStyles = `
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes slideOut { from { transform: translateY(0); opacity: 1 } to { transform: translateY(20px); opacity: 0 } }
  .animate-fadeIn  { animation: fadeIn 0.3s ease-out forwards }
  .animate-fadeOut { animation: fadeOut 0.3s ease-out forwards }
  .animate-slideIn { animation: slideIn 0.3s ease-out forwards }
  .animate-slideOut{ animation: slideOut 0.3s ease-out forwards }
`

const FormularioProyecto = ({ title, values, handleChange, handleSubmit, onClose }) => {
  const { clientes } = useClientes()
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "auto" }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 300)
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isClosing ? "animate-fadeOut" : "animate-fadeIn"
        }`}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div
          className={`relative bg-white rounded-lg shadow-xl w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 max-h-[85vh] overflow-y-auto p-6 transition-all duration-300 ${
            isClosing ? "animate-slideOut" : "animate-slideIn"
          }`}
        >
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-white">
              {title || "Agregar Proyecto"}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Nombre */}
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Nombre del proyecto"
              value={values.nombre}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
            />

            {/* Descripción */}
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Descripción"
              value={values.descripcion}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24 resize-none focus:border-blue-500 focus:ring-blue-500"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tiempo Estimado ahora como número entero */}
              <div className="flex flex-col">
                <label
                  htmlFor="tiempoEstimado"
                  className="mb-1 text-sm font-medium"
                >
                  Tiempo Estimado (horas)
                </label>
                <input
                  id="tiempoEstimado"
                  name="tiempoEstimado"
                  type="number"
                  min="0"
                  step="1"
                  value={values.tiempoEstimado}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Fecha de entrega */}
              <div className="flex flex-col">
                <label
                  htmlFor="fechaEntrega"
                  className="mb-1 text-sm font-medium"
                >
                  Fecha de Entrega
                </label>
                <input
                  id="fechaEntrega"
                  name="fechaEntrega"
                  type="date"
                  value={values.fechaEntrega}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estado */}
              <select
                id="estado"
                name="estado"
                value={values.estado}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccione un estado</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="finalizado">Finalizado</option>
              </select>

              {/* Prioridad */}
              <select
                id="prioridad"
                name="prioridad"
                value={values.prioridad}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccione una prioridad</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* Cliente */}
            <select
              id="cliente"
              name="cliente"
              value={values.cliente || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            {/* Color */}
            <div>
              <label htmlFor="color" className="block mb-2">
                Color del Proyecto
              </label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded border border-gray-300 relative">
                  <input
                    id="color"
                    name="color"
                    type="color"
                    value={values.color || "#2196F3"}
                    onChange={handleChange}
                    className="w-full h-full opacity-0 cursor-pointer absolute top-0 left-0"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#2196F3",
                    "#4CAF50",
                    "#F44336",
                    "#FFC107",
                    "#9C27B0",
                    "#FF9800",
                    "#795548",
                    "#607D8B",
                  ].map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-10 h-10 rounded border ${
                        values.color === color
                          ? "ring-2 ring-offset-1 ring-blue-500"
                          : "border-gray-300 hover:border-gray-400"
                      } transition-all`}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        handleChange({ target: { name: "color", value: color } })
                      }
                      aria-label="Seleccionar color"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="!bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {title || "Agregar Proyecto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default FormularioProyecto
