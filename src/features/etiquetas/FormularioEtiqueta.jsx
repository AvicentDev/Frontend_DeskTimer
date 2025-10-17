import React from 'react';
import { PlusCircle } from 'lucide-react';

const FormularioEtiqueta = ({ values, handleChange, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold text-center">Insertar Etiqueta</h2>

    <label className="flex flex-col">
      <span className="text-gray-600">Nombre</span>
      <input
        name="nombre"
        type="text"
        value={values.nombre}
        onChange={handleChange}
        className="mt-1 p-2 border rounded"
        placeholder="Nombre de la etiqueta"
        required
      />
    </label>

    <button
      type="submit"
      className="flex items-center justify-center gap-2 px-4 py-2 !bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      <PlusCircle className="w-5 h-5" /> Insertar Etiqueta
    </button>
  </form>
);

export default FormularioEtiqueta;
