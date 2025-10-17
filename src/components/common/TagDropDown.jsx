// TagDropdown.jsx
"use client";

import { Search, Tag } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function TagDropDown({
  etiquetas = [],
  selectedIds = [],
  onChange = () => {},
  onCreateTag = () => {},
  loading = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef(null);

  // Cierra el dropdown si haces click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = etiquetas.filter((t) =>
    t.nombre.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleTag = (id) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(updated);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Seleccionar etiquetas"
        onClick={() => {
          setIsOpen((prev) => {
            const opening = !prev;
            // Si el menú se va a abrir, refresca etiquetas
            if (opening) {
              onCreateTag();
            }
            return opening;
          });
        }}
      >
        <Tag className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white text-black rounded-lg shadow-lg z-20 border border-gray-200">
          {/* Buscador */}
          <div className="flex items-center px-3 py-2 border-b border-gray-200">
            <Search className="h-4 w-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Buscar o añadir etiquetas"
              className="w-full bg-transparent placeholder-gray-500 focus:outline-none text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {/* Lista de etiquetas */}
          <div className="max-h-48 overflow-auto">
            {loading && (
              <p className="p-3 text-gray-500 text-sm">Cargando etiquetas…</p>
            )}
            {!loading && filtered.length === 0 && (
              <p className="p-3 text-gray-500 text-sm">No hay etiquetas</p>
            )}
            {!loading &&
              filtered.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-500 mr-2"
                    checked={selectedIds.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                  />
                  <span>{tag.nombre}</span>
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
