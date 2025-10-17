"use client"
import { useState, useRef, useEffect } from "react"
import { Filter, ChevronDown, Check } from "lucide-react"

export default function FilterButton({ filterOptions, setFilterOptions }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleOption = (id) => {
    if (id === "all") {
      // Si se selecciona "Mostrar todos", desactivar los demás
      setFilterOptions(
        filterOptions.map((option) => ({
          ...option,
          selected: option.id === "all",
        }))
      );
    } else {
      // Si se selecciona otro filtro, desactivar "all" y los demás, y activar solo el seleccionado
      setFilterOptions(
        filterOptions.map((option) =>
          option.id === id
            ? { ...option, selected: true }
            : { ...option, selected: false }
        )
      );
    }
  };
  

  const clearFilters = () => {
    setFilterOptions(
      filterOptions.map((option) => ({
        ...option,
        selected: option.id === "all",
      })),
    )
  }

  // Contar cuántos filtros están seleccionados
  const selectedCount = filterOptions.filter((option) => option.selected).length
  const onlyAllSelected = selectedCount === 1 && filterOptions[0].selected

  const classNames = (...classes) => classes.filter(Boolean).join(" ")

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
          "border shadow-sm hover:shadow",
          selectedCount > 0 && !onlyAllSelected
            ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
        )}
      >
        <Filter
          className={classNames(
            "h-4 w-4",
            selectedCount > 0 && !onlyAllSelected ? "text-blue-500" : "text-gray-500"
          )}
        />
        <span>
          {onlyAllSelected
            ? "Todos los filtros"
            : selectedCount > 0
              ? `${selectedCount} filtros aplicados`
              : "Sin filtros"}
        </span>
        <ChevronDown
          className={classNames(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "",
            selectedCount > 0 && !onlyAllSelected ? "text-blue-500" : "text-gray-500"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-auto min-w-[16rem] rounded-lg bg-white shadow-lg border border-gray-200 py-2">
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-gray-700">Filtrar tareas</h3>
              <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700">
                Restablecer
              </button>
            </div>
          </div>
          <div className="py-1">
            {filterOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <div
                  className={classNames(
                    "w-5 h-5 rounded flex items-center justify-center mr-3 border",
                    option.selected ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300"
                  )}
                >
                  {option.selected && <Check className="h-3.5 w-3.5" />}
                </div>
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
