"use client";

import React, { useState, useEffect } from "react";
import { getMiembros } from "../../../data/MiembrosData";
import axios from "axios";
import { config } from "../../../utils/config";

const ROLES = ["Administrador", "Desarrollador", "Diseñador", "Tester", "Otro"];

const ProjectMemberForm = ({
  proyectoId,
  existingMembers = [],
  onNotify,
  onClose,
  onSubmit,
}) => {
  const [miembros, setMiembros] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [rol, setRol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga la lista de posibles miembros
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getMiembros(); // Asegúrate de que devuelve también `rol`
        setMiembros(data);
      } catch (err) {
        console.error(err);
        setError("Error cargando miembros");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Cuando cambias el selector de miembro
  const handleMemberChange = (e) => {
    const memberId = Number(e.target.value);
    setSelectedMember(memberId);
    setError(null);

    const found = miembros.find((m) => m.id === memberId);
    if (found?.rol) {
      // Si el miembro tiene rol predefinido en BD → asignarlo y bloquear edición
      setRol(found.rol);
    } else {
      // Si no tiene rol predefinido → permitir selección manual
      setRol("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember || !rol || !proyectoId) {
      onNotify("Selecciona miembro, rol y proyecto válido", "error");
      return;
    }

    const memberId = Number(selectedMember);

    if (existingMembers.some((m) => m.id === memberId)) {
      onNotify("El miembro ya existe en el proyecto", "error");
      return;
    }

    try {
      await axios.post(
        `${config.BASE_URL}/proyectos/${proyectoId}/miembros`,
        { miembros: [{ id: memberId, rol }] },
        { headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` } }
      );

      const found = miembros.find((m) => m.id === memberId);
      const nuevo = { id: memberId, nombre: found?.nombre ?? "", rol };
      onSubmit(nuevo);
      onNotify("Miembro añadido correctamente", "success");
      onClose();
    } catch (err) {
      console.error(err);
      onNotify("Error añadiendo miembro", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Añadir Miembro</h2>

        {loading && <p>Cargando miembros…</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Miembro</label>
              <select
                value={selectedMember}
                onChange={handleMemberChange}
                className="w-full mt-1 p-2 border rounded"
                required
              >
                <option value="">Selecciona un miembro</option>
                {miembros.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Si el miembro tiene rol predefinido → mostrarlo como texto */}
            {selectedMember &&
            miembros.find((m) => m.id === selectedMember)?.rol ? (
              <div className="mb-4">
                <label className="block text-gray-700">Rol (predefinido)</label>
                <p className="mt-1 p-2 bg-gray-100 rounded">{rol}</p>
                <input type="hidden" name="rol" value={rol} />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-gray-700">Rol</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full mt-1 p-2 border rounded"
                  required
                >
                  <option value="">Selecciona un rol</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 !bg-gray-300 rounded hover:bg-gray-400"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 !bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProjectMemberForm;
