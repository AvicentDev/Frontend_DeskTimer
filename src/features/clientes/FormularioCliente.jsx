import React from 'react';
import { PlusCircle } from 'lucide-react';

const FormularioCliente = ({ values, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-4/5 md:w-3/4 lg:w-2/3 mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Insertar Cliente</h2>
      
      <div>
        <label className="block text-gray-600">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholder="Ingrese el nombre del cliente"
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
          placeholder="Ingrese el email del cliente"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-600">Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={values.telefono}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholder="Ingrese el teléfono del cliente (9 dígitos)"
          required
        />
      </div>
      
      <button
        type="submit"
        className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        <PlusCircle className="w-5 h-5" />
        Insertar Cliente
      </button>
    </form>
  );
};

export default FormularioCliente;
