"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus, 
  fetchSolicitudes, 
  loading 
}) => {
  const [soloPendientes, setSoloPendientes] = useState(true);

  // Al montar el componente, si el checkbox está marcado, forzamos el filtro a "pendiente"
  useEffect(() => {
    if (soloPendientes && filterStatus !== "pendiente") {
      setFilterStatus("pendiente");
    }
  }, [soloPendientes, filterStatus, setFilterStatus]);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSoloPendientes(isChecked);
    setFilterStatus(isChecked ? "pendiente" : "todos");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuario o motivo"
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("todos");
              setSoloPendientes(false);
            }}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Limpiar filtros
          </button>
          <button
            onClick={fetchSolicitudes}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className={`mr-2 h-4 w-4 text-gray-500 ${loading ? "animate-spin" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Actualizar
          </button>
        </div>
        <div className="flex items-center ml-auto">
          <input
            type="checkbox"
            id="soloPendientes"
            checked={soloPendientes}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="soloPendientes" className="text-sm text-gray-700">
            Solo pendientes de validar
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
