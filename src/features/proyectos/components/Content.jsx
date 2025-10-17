"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import AgregarProyecto from "../utils/AgregarProyecto";
import EditarProyecto from "../utils/EditarProyecto";
import { getProyectos } from "../../../data/ProyectoData";
import { getProyectosArchivados } from "../../../data/ProyectosArchivados";
import ProjectTable from "../components/ProyectoTable";
import ActionBar from "../utils/ActionBar";
import useSelection from "../../../hooks/useSelection";
import useClientes from "../../../hooks/useClientes";
import ProjectDetails from "./ProjectDetails";
import { ToastContainer } from "../utils/Toast";
import FilterPanel from "../utils/FilterPanel";

const ContentProyectos = ({
  projectsData,
  setProjectsData,
  refreshProject,
  selectedProyectoDetail,
  setSelectedProyectoDetail,
}) => {
  // Estado interno de proyectos
  const [internalDataProyectos, setInternalDataProyectos] = useState({
    proyectos: [],
  });
  const dataProyectos = projectsData || internalDataProyectos;
  const setDataProyectos = setProjectsData || setInternalDataProyectos;

  // Estado interno de detalle
  const [internalSelectedProyectoDetail, setInternalSelectedProyectoDetail] =
    useState(null);
  const _selectedProyectoDetail =
    selectedProyectoDetail || internalSelectedProyectoDetail;
  const setSelectedProyectoDetailFn =
    setSelectedProyectoDetail || setInternalSelectedProyectoDetail;

  // Modales y selección
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);

  // Loading, error, toasts
  const [loadingT, setLoadingT] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Filtros
  const [filter, setFilter] = useState({
    status: "active",
    projectName: "",
    client: "",
  });

  // Hooks de selección y clientes
  const {
    selectedItems: selectedProjects,
    handleSelectItem,
    handleSelectAll,
    clearSelection,
    allSelected,
  } = useSelection(dataProyectos.proyectos);
  const { clientes } = useClientes();

  // Gestión de toasts
  // en ContentProyectos.jsx:
const addToast = useCallback((message, type = "success") => {
  const id = Date.now();
  setToasts(prev => [...prev, { id, message, type }]);
}, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Formatea el tiempo estimado
  function formatTiempoEstimado(value) {
    if (value == null) return "—";
    if (typeof value === "number") return `${value}h 0m`;
    if (typeof value === "string") {
      const parts = value.split(":").map(Number);
      if (parts.length < 2 || parts.some(isNaN)) return "—";
      const [hh, mm, ss = 0] = parts;
      const totalSeconds = hh * 3600 + mm * 60 + ss;
      if (totalSeconds <= 0) return "—";
      const horas = Math.floor(totalSeconds / 3600);
      const minutos = Math.floor((totalSeconds % 3600) / 60);
      return `${horas}h ${minutos}m`;
    }
    return "—";
  }

  // Fetch activos y archivados
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingT(true);
        let data;
        if (filter.status === "archived") {
          data = await getProyectosArchivados();
          data = {
            proyectos: data.proyectos.map((p) => {
              let info = {};
              if (p.info_proyecto) {
                try {
                  info = JSON.parse(p.info_proyecto);
                } catch {}
              }
              return { ...p, ...info };
            }),
          };
        } else {
          data = await getProyectos();
        }
        setDataProyectos({ proyectos: data.proyectos });
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error desconocido");
        addToast({
          type: "error",
          message: `Error cargando proyectos: ${err?.message || "Desconocido"}`,
        });
      } finally {
        setLoadingT(false);
      }
    };
    fetch();
  }, [filter.status, addToast, setDataProyectos]);

  // Filtrado por nombre y cliente
  const filteredProyectos = dataProyectos.proyectos.filter((p) => {
    if (
      filter.projectName &&
      !p.nombre.toLowerCase().includes(filter.projectName.toLowerCase())
    )
      return false;
    if (
      filter.client &&
      (!p.cliente || String(p.cliente.id) !== filter.client)
    )
      return false;
    return true;
  });

  // Refresca un solo proyecto tras stopTimer
  const internalRefreshProject = (projectId, newEntry) => {
    setSelectedProyectoDetailFn((prev) =>
      prev && prev.id === projectId
        ? { ...prev, entradas_tiempo: [...(prev.entradas_tiempo || []), newEntry] }
        : prev
    );
    setDataProyectos((prev) => ({
      ...prev,
      proyectos: prev.proyectos.map((p) =>
        p.id === projectId
          ? { ...p, entradas_tiempo: [...(p.entradas_tiempo || []), newEntry] }
          : p
      ),
    }));
  };
  const _refreshProject = refreshProject || internalRefreshProject;

  // Handlers CRUD...
  const handleAgregarProyecto = (nuevoProyecto) => {
    const clienteObj =
      nuevoProyecto.cliente ||
      clientes.find((c) => c.id === nuevoProyecto.cliente_id) ||
      null;
    setDataProyectos((prev) => ({
      ...prev,
      proyectos: [...prev.proyectos, { ...nuevoProyecto, cliente: clienteObj }],
    }));
    setIsAddModalOpen(false);
    addToast({
      type: "success",
      message: `Proyecto "${nuevoProyecto.nombre}" creado correctamente`,
    });
  };
  const handleBorrarProyectos = (ids) => {
    const nombres = dataProyectos.proyectos
      .filter((p) => ids.includes(p.id))
      .map((p) => p.nombre)
      .join(", ");
    setDataProyectos((prev) => ({
      ...prev,
      proyectos: prev.proyectos.filter((p) => !ids.includes(p.id)),
    }));
    clearSelection();
    addToast({
      type: "success",
      message:
        ids.length === 1
          ? `Proyecto "${nombres}" eliminado correctamente`
          : `${ids.length} proyectos eliminados correctamente`,
    });
  };
  const handleArchiveProjects = (ids) => {
    setDataProyectos((prev) => ({
      ...prev,
      proyectos: prev.proyectos.filter((p) => !ids.includes(p.id)),
    }));
    clearSelection();
    addToast({
      type: "success",
      message:
        ids.length === 1
          ? "Proyecto archivado correctamente"
          : `${ids.length} proyectos archivados correctamente`,
    });
  };
  const handleSelectProject = (p) => {
    handleSelectItem(p.id);
    setSelectedProyecto(p);
  };
  const handleEditProject = (p) => {
    setSelectedProyecto(p);
    setIsEditModalOpen(true);
  };
  const handleViewProjectDetail = (p) => {
    setSelectedProyectoDetailFn(p);
  };
  const handleEditarProyecto = (edited) => {
    const clienteObj = clientes.find((c) => c.id === edited.cliente_id) || null;
    setDataProyectos((prev) => ({
      ...prev,
      proyectos: prev.proyectos.map((p) =>
        p.id === edited.id ? { ...edited, cliente: clienteObj } : p
      ),
    }));
    setIsEditModalOpen(false);
    clearSelection();
    addToast({
      type: "success",
      message: `Proyecto "${edited.nombre}" actualizado correctamente`,
    });
  };
  const handleRestoreProjects = (ids) => {
    setDataProyectos((prev) => ({
      ...prev,
      proyectos: prev.proyectos.filter((p) => !ids.includes(p.id)),
    }));
    clearSelection();
    addToast({
      type: "success",
      message:
        ids.length === 1
          ? "Proyecto restaurado correctamente"
          : `${ids.length} proyectos restaurados correctamente`,
    });
  };

  if (loadingT)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  if (error)
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

  return (
    <main className="flex-1 p-8 overflow-auto relative">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Proyectos</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 !bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Agregar Proyecto
          </button>
        </div>
        <FilterPanel filter={filter} setFilter={setFilter} clientes={clientes} />
        {selectedProjects.length > 0 && (
          <ActionBar
            count={selectedProjects.length}
            onClear={clearSelection}
            selectedProjects={selectedProjects}
            proyectos={dataProyectos.proyectos}
            onDelete={handleBorrarProyectos}
            onEdit={handleEditProject}
            onArchive={handleArchiveProjects}
            isArchived={filter.status === "archived"}
            onRestore={handleRestoreProjects}
          />
        )}
        <ProjectTable
          proyectos={filteredProyectos}
          selectedProjects={selectedProjects}
          allSelected={allSelected}
          onSelectAll={handleSelectAll}
          onSelectProject={handleSelectProject}
          formatTiempoEstimado={formatTiempoEstimado}
          onProjectClick={handleViewProjectDetail}
          refreshProject={_refreshProject}
        />
      </div>

      {isAddModalOpen && (
        <AgregarProyecto
          onAgregar={handleAgregarProyecto}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && selectedProyecto && (
        <EditarProyecto
          proyecto={selectedProyecto}
          onEditar={handleEditarProyecto}
          onBorrar={(id) => {
            handleBorrarProyectos([id]);
            setIsEditModalOpen(false);
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {_selectedProyectoDetail && (
        <ProjectDetails
          project={_selectedProyectoDetail}
          setDataProyectos={setDataProyectos}
          setSelectedProyectoDetail={setSelectedProyectoDetailFn}
          onClose={() => setSelectedProyectoDetailFn(null)}
          refreshProject={_refreshProject}
          onNotify={addToast}
        />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  );
};

export default ContentProyectos;
