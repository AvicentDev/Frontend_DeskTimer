import React from 'react';
import { PlusCircle } from 'lucide-react';

const FormularioMiembro = ({ values, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-4/5 md:w-3/4 lg:w-2/3 mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Insertar Miembro</h2>
      
      <div>
        <label className="block text-gray-600">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholder="Ingrese el nombre del miembro"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-600">Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholder="Ingrese el email del miembro"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-600">Rol</label>
        <select
          name="rol"
          value={values.rol}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          required
        >
          <option value="">Seleccione un rol</option>
          <option value="administrador">Administrador</option>
          <option value="desarrollador">Desarrollador</option>
          <option value="diseñador">Diseñador</option>
          <option value="tester">Tester</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 !bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        <PlusCircle className="w-5 h-5" />
        Insertar Miembro
      </button>
    </form>
  );
};

export default FormularioMiembro;
