// AdminSolicitudes.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { config } from "../../../utils/config";
import { getSolicitudes } from "../../../data/SolicitudesData";
import FilterBar from "./FilterBar";
import TableRow from "./TableRow";

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSolicitudes();
      setSolicitudes(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      setError("No se pudieron cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  useEffect(() => {
    let result = [...solicitudes];

    if (searchTerm) {
      result = result.filter(
        sol =>
          sol.usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sol.comentario?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "todos") {
      result = result.filter(
        sol => sol.estado?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredSolicitudes(result);
  }, [searchTerm, filterStatus, solicitudes, sortConfig]);

  const formatDate = dateString => {
    if (!dateString || typeof dateString !== 'string') {
      return 'Fecha no válida';
    }
  
    // 1) Nos quedamos sólo con la parte "YYYY-MM-DD"
    const fechaSolo = dateString.split(/T| /)[0];
  
    // 2) Descomponemos en [year, month, day]
    const parts = fechaSolo.split('-');
    if (parts.length !== 3) {
      return 'Fecha no válida';
    }
    const [year, month, day] = parts;
  
    // 3) Comprobamos que sean valores válidos
    if (!year || !month || !day) {
      return 'Fecha no válida';
    }
  
    // 4) Devolvemos con ceros a la izquierda: dd/mm/yyyy
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  };
  
  
  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
  
      const endpoint = `${config.BASE_URL}/solicitudes/${id}/${action === "approve" ? "aprobar" : "rechazar"}`;
  
      await axios.put(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setSolicitudes(prev =>
        prev.map(sol =>
          sol.id === id
            ? { ...sol, estado: action === "approve" ? "aprobado" : "rechazado" }
            : sol
        )
      );
    } catch (err) {
      console.error("Error al procesar la acción:", err);
      alert("No se pudo actualizar la solicitud.");
    }
  };
  

  const renderStatus = status => {
    const s = status?.toLowerCase();
    if (s === "pendiente") return <span className="text-yellow-600">Pendiente</span>;
    if (s === "aprobado") return <span className="text-green-600">Aprobado</span>;
    if (s === "rechazado") return <span className="text-red-600">Rechazado</span>;
    return <span>{status}</span>;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Solicitudes de Tiempo</h1>
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          fetchSolicitudes={fetchSolicitudes}
          loading={loading}
        />
        {error && <div className="text-red-600 mt-4">{error}</div>}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th>Usuario</th>
                <th>Motivo</th>
                <th>Tiempo</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSolicitudes.length > 0 ? (
                filteredSolicitudes.map(sol => (
                  <TableRow
                    key={sol.id}
                    solicitud={sol}
                    formatDate={formatDate}
                    handleAction={handleAction}
                    renderStatus={renderStatus}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No hay solicitudes disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
