import React, { useState, useEffect } from "react";
import useProyectos from "../../../hooks/useProyectos";
import useClientes from "../../../hooks/useClientes";
import useEtiquetas from "../../../hooks/useEtiquetas";

export default function AddEventModal({
  setShowAddEventModal,
  addEvent,
  defaultStartTime = "",
  defaultEndTime = ""
}) {
  const { projects, loading: loadingProyectos, error: errorProyectos } = useProyectos();
  const { clientes, loading: loadingClientes, error: errorClientes } = useClientes();
  const { etiquetas, loading: loadingEtiquetas, refreshEtiquetas } = useEtiquetas();

  const [formData, setFormData] = useState({
    title:     "",
    project:   "",
    client:    "",
    tags:      [],            // aquí guardamos los IDs seleccionados
    startTime: defaultStartTime,
    endTime:   defaultEndTime
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFormData(f => ({
      ...f,
      startTime: defaultStartTime,
      endTime:   defaultEndTime
    }));
  }, [defaultStartTime, defaultEndTime]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleCheckbox = (id) => {
    setFormData(f => {
      const has = f.tags.includes(id);
      return {
        ...f,
        tags: has 
          ? f.tags.filter(t => t !== id) 
          : [...f.tags, id]
      };
    });
  };

  const handleCreateEtiqueta = async () => {
    const nombre = prompt("Nombre de la nueva etiqueta:");
    if (!nombre) return;
    // TODO: aquí llamarías a tu API para crearla, p.ej:
    // await axios.post(`${config.BASE_URL}/etiqueta`, { nombre }, { headers: ... });
    await refreshEtiquetas();           // recarga del hook
    // Opcional: marcar la recién creada
  };

  const handleSubmit = e => {
    e.preventDefault();
    addEvent(formData);
  };

  // Filtrar etiquetas según búsqueda
  const filtered = etiquetas.filter(et => {
    const label = et.nombre || et.label || et.name;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowAddEventModal(false)}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Agregar Evento</h3>
          <button
            onClick={() => setShowAddEventModal(false)}
            aria-label="Cerrar modal"
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Descripción */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              ¿En qué estás trabajando?
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Descripción de la tarea"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Proyecto y Cliente */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                Proyecto
              </label>
              <select
                id="project"
                name="project"
                required
                value={formData.project}
                onChange={handleChange}
                disabled={loadingProyectos}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                {loadingProyectos
                  ? <option>Cargando...</option>
                  : errorProyectos
                    ? <option>Error al cargar</option>
                    : projects.length === 0
                      ? <option>No hay proyectos</option>
                      : (
                        <>
                          <option value="">Selecciona un proyecto</option>
                          {projects.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.nombre || p.titulo || p.name}
                            </option>
                          ))}
                        </>
                      )
                }
              </select>
            </div>

            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                disabled={loadingClientes}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                {loadingClientes
                  ? <option>Cargando...</option>
                  : errorClientes
                    ? <option>Error al cargar</option>
                    : clientes.length === 0
                      ? <option>No hay clientes</option>
                      : (
                        <>
                          <option value="">Selecciona un cliente</option>
                          {clientes.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.nombre || c.razon_social || c.name}
                            </option>
                          ))}
                        </>
                      )
                }
              </select>
            </div>
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Hora de inicio
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                Hora de fin
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Etiquetas con checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>


            {/* Listado scrollable */}
            <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
              {loadingEtiquetas
                ? <p className="text-center text-gray-500">Cargando...</p>
                : filtered.length === 0
                  ? <p className="text-gray-500">No hay etiquetas</p>
                  : filtered.map(et => {
                      const label = et.nombre || et.label || et.name;
                      return (
                        <label
                          key={et.id}
                          className="flex items-center mb-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600"
                            checked={formData.tags.includes(et.id)}
                            onChange={() => handleCheckbox(et.id)}
                          />
                          <span className="ml-2 text-gray-800">{label}</span>
                        </label>
                      );
                    })
              }
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setShowAddEventModal(false)}
              className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg !bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
