"use client"
import { useState, useRef, useEffect } from "react"
import { Search, Filter, RefreshCw, ChevronDown, X } from "lucide-react"

const FilterPanel = ({ filter, setFilter, clientes }) => {
  // Estados para controlar el focus de cada select
  const [projectsFocused, setProjectsFocused] = useState(false)
  const [clientsFocused, setClientsFocused] = useState(false)

  // Referencias para detectar clicks fuera de los elementos
  const projectsRef = useRef(null)
  const clientsRef = useRef(null)

  // Helper function para combinar clases condicionales
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ")
  }

  // Efecto para detectar clicks fuera de los elementos
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectsRef.current && !projectsRef.current.contains(event.target)) {
        setProjectsFocused(false)
      }
      if (clientsRef.current && !clientsRef.current.contains(event.target)) {
        setClientsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="w-full mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Dropdown de estado de proyectos - Con animación */}
        <div className="relative" ref={projectsRef}>
          <div className="flex items-center gap-2 relative min-w-[180px]">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Filter
                size={16}
                className={classNames(
                  "transition-colors duration-200",
                  filter.status !== "active" ? "text-blue-500" : "text-gray-500",
                )}
              />
            </div>
            <select
              value={filter.status}
              onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
              onFocus={() => setProjectsFocused(true)}
              className={classNames(
                "appearance-none w-full pl-10 pr-10 py-2.5 rounded-lg text-sm font-medium",
                "border shadow-sm transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                filter.status !== "active"
                  ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300",
              )}
            >
              <option value="active">Proyectos Activos</option>
              <option value="archived">Proyectos Archivados</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown
                size={16}
                className={classNames(
                  "transition-transform duration-200",
                  projectsFocused ? "rotate-180" : "",
                  filter.status !== "active" ? "text-blue-500" : "text-gray-500",
                )}
              />
            </div>
          </div>
        </div>

        {/* Campo de búsqueda */}
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              size={16}
              className={classNames(
                "transition-colors duration-200",
                filter.projectName ? "text-blue-500" : "text-gray-400",
              )}
            />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={filter.projectName}
            onChange={(e) => setFilter((prev) => ({ ...prev, projectName: e.target.value }))}
            className={classNames(
              "w-full pl-10 pr-10 py-2.5 rounded-lg text-sm",
              "border shadow-sm transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              filter.projectName
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300",
            )}
          />
          {filter.projectName && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, projectName: "" }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={16} className="text-blue-500 hover:text-blue-700 transition-colors duration-200" />
            </button>
          )}
        </div>

        {/* Dropdown de clientes - Con animación */}
        <div className="relative" ref={clientsRef}>
          <div className="flex items-center gap-2 relative min-w-[180px]">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Filter
                size={16}
                className={classNames(
                  "transition-colors duration-200",
                  filter.client ? "text-blue-500" : "text-gray-500",
                )}
              />
            </div>
            <select
              value={filter.client}
              onChange={(e) => setFilter((prev) => ({ ...prev, client: e.target.value }))}
              onFocus={() => setClientsFocused(true)}
              className={classNames(
                "appearance-none w-full pl-10 pr-10 py-2.5 rounded-lg text-sm font-medium",
                "border shadow-sm transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                filter.client
                  ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300",
              )}
            >
              <option value="">Todos los clientes</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown
                size={16}
                className={classNames(
                  "transition-transform duration-200",
                  clientsFocused ? "rotate-180" : "",
                  filter.client ? "text-blue-500" : "text-gray-500",
                )}
              />
            </div>
          </div>
        </div>

        {/* Botón de Limpiar filtros - Con animación */}
        <button
          onClick={() => {
            setFilter({ status: "active", projectName: "", client: "" })
            setProjectsFocused(false)
            setClientsFocused(false)
          }}
          className={classNames(
            "flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium",
            "transition-all duration-200",
            filter.status !== "active" || filter.projectName || filter.client
              ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
          )}
        >
          <RefreshCw size={16} className="transition-transform duration-200 hover:rotate-180" />
          <span>Limpiar filtros</span>
        </button>
      </div>
    </div>
  )
}

export default FilterPanel

  