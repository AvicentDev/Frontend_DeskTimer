import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../../utils/config";
import useEtiquetas from "../../../hooks/useEtiquetas";

export default function EditEventModal({
  event,
  onChange,
  onCancel,
  onSave,
  onDelete,
  isClosing = false,
}) {
  if (!event) return null;

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const { etiquetas, loading: loadingEtiquetas, refreshEtiquetas } = useEtiquetas();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoadingProjects(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${config.BASE_URL}/proyectos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.proyectos || [];
        setProjects(data);
      })
      .catch(err => console.error("Error cargando proyectos en EditEventModal:", err))
      .finally(() => setLoadingProjects(false));
  }, []);

  const initialTagIds = Array.isArray(event.etiquetas)
    ? event.etiquetas.map(et => et.id)
    : [];
  const [selectedTags, setSelectedTags] = useState(initialTagIds);

  // 🔁 Cargar etiquetas desde backend al abrir modal
  useEffect(() => {
    if (!event || !event.id) return;

    const token = localStorage.getItem("token");
    axios
      .get(`${config.BASE_URL}/entrada_tiempo/${event.id}/etiquetas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const tags = Array.isArray(res.data) ? res.data : res.data.etiquetas || [];
        setSelectedTags(tags.map(et => et.id));
        onChange({ ...event, etiquetas: tags });
      })
      .catch(err => {
        console.error("Error al cargar etiquetas del evento:", err);
      });
  }, [event?.id]);

  // 🔁 Si cambia event.etiquetas desde afuera
  useEffect(() => {
    setSelectedTags(
      Array.isArray(event.etiquetas) ? event.etiquetas.map(et => et.id) : []
    );
  }, [event.etiquetas]);

  const fechaISO = event.date.toISOString().slice(0, 10);

  const handleProjectChange = e => {
    const id = Number(e.target.value) || null;
    const proj = projects.find(p => p.id === id);
    onChange({
      ...event,
      proyecto_id: id,
      title: proj?.nombre || event.title,
      color: proj?.color || event.color,
    });
  };

  const handleFieldChange = (field, value) => {
    onChange({ ...event, [field]: value });
  };

  const handleCheckbox = id => {
    const next = selectedTags.includes(id)
      ? selectedTags.filter(t => t !== id)
      : [...selectedTags, id];
    setSelectedTags(next);
    // Actualizamos event.etiquetas como lista de objetos { id }
    const updatedEtiquetas = etiquetas
      .filter(et => next.includes(et.id))
      .map(et => ({ id: et.id, nombre: et.nombre }));
    onChange({ ...event, etiquetas: updatedEtiquetas });
  };

  const handleCreateEtiqueta = async () => {
    const nombre = prompt("Nombre de la nueva etiqueta:");
    if (!nombre) return;
    // Aquí podrías hacer la llamada POST si lo deseas
    await refreshEtiquetas();
  };

  const filtered = etiquetas.filter(et => {
    const label = et.nombre || et.label || et.name;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  console.log("🧪 Evento en modal:", event);

  return (
    <div
      className={`
        fixed inset-0
        bg-gradient-to-br from-gray-500/20 to-blue-500/20
        backdrop-blur-sm flex items-center justify-center
        z-50 transition-all duration-300
        ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}
      `}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 w-96 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Editar Evento</h2>

        {/* Proyecto */}
        <label className="block mb-4">
          <span className="text-sm font-medium">Proyecto</span>
          <select
            className="mt-1 block w-full border rounded-md p-2"
            value={event.proyecto_id ?? ""}
            onChange={handleProjectChange}
            disabled={loadingProjects}
          >
            {loadingProjects ? (
              <option value="">Cargando proyectos…</option>
            ) : (
              <>
                <option value="">Sin proyecto</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </>
            )}
          </select>
        </label>

        {/* Título */}

        <label className="block mb-2">
          <span className="text-sm font-medium">Título</span>
          <input
            type="text"
            className="mt-1 block w-full border rounded-md p-2"
            value={event.description}
            onChange={e => handleFieldChange("description", e.target.value)}
          />
        </label>


        {/* Fecha */}
        <label className="block mb-2">
          <span className="text-sm font-medium">Fecha</span>
          <input
            type="date"
            className="mt-1 block w-full border rounded-md p-2"
            value={fechaISO}
            onChange={e => handleFieldChange("date", new Date(e.target.value))}
          />
        </label>

        {/* Horas */}
        <div className="flex space-x-2 mb-4">
          <label className="flex-1">
            <span className="text-sm font-medium">Inicio</span>
            <input
              type="time"
              className="mt-1 block w-full border rounded-md p-2"
              value={event.startTime}
              onChange={e => handleFieldChange("startTime", e.target.value)}
            />
          </label>
          <label className="flex-1">
            <span className="text-sm font-medium">Fin</span>
            <input
              type="time"
              className="mt-1 block w-full border rounded-md p-2"
              value={event.endTime || ""}
              onChange={e => handleFieldChange("endTime", e.target.value)}
            />
          </label>
        </div>

        {/* Color */}
        <label className="block mb-4">
          <span className="text-sm font-medium">Color</span>
          <input
            type="color"
            className="mt-1"
            value={event.color || "#ec4899"}
            onChange={e => handleFieldChange("color", e.target.value)}
          />
        </label>

        {/* Etiquetas */}
        <div className="mb-4">
          <span className="text-sm font-medium block mb-1">Etiquetas</span>
          <div className="max-h-40 overflow-y-auto border rounded-lg p-2 mb-2">
            {loadingEtiquetas ? (
              <p className="text-center text-gray-500">Cargando...</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-500">No hay etiquetas</p>
            ) : (
              filtered.map(et => {
                const label = et.nombre || et.label || et.name;
                return (
                  <label
                    key={et.id}
                    className="flex items-center mb-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={selectedTags.includes(et.id)}
                      onChange={() => handleCheckbox(et.id)}
                    />
                    <span className="ml-2 text-gray-800">{label}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="px-4 py-2 rounded-lg !bg-blue-500 text-white hover:bg-red-600"
            onClick={() => onDelete(event.id)}
          >
            Eliminar
          </button>

          <div className="flex space-x-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg !bg-gray-200 hover:bg-gray-300"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg !bg-blue-500 text-white hover:bg-pink-600"
              onClick={onSave}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
