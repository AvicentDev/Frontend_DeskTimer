import React, { useContext } from 'react';
import axios from 'axios';
import useForm from '../../hooks/useForm';
import { Edit2, Trash2 } from 'lucide-react';
import { config } from '../../utils/config';
import { AuthContext } from '../../components/auth/AuthContext';

const EditarCliente = ({ cliente, onEditar, onBorrar, onClose }) => {
  const { user } = useContext(AuthContext);
  const { values, handleChange, resetForm } = useForm({
    nombre: cliente.nombre || '',
    email: cliente.email || '',
    telefono: cliente.telefono || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('No hay usuario logueado');
      return;
    }
    const updatedCliente = {
      ...values,
      usuario_id: user.id,
    };
    try {
      const response = await axios.put(
        `${config.BASE_URL}/clientes/${cliente.id}`,
        updatedCliente,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );
      if (onEditar) {
        onEditar(response.data.cliente);
      }
      resetForm();
      if (onClose) onClose();
    } catch (error) {
      if (error.response) {
        console.error('Error en la respuesta del servidor:', error.response.data);
      } else {
        console.error('Error al enviar la petición:', error.message);
      }
    }
  };

  const handleDelete = async () => {
    if (!user) {
      console.error('No hay usuario logueado');
      return;
    }
    try {
      await axios.delete(
        `${config.BASE_URL}/clientes/${cliente.id}`,
        {
          headers: {
            'Authorization': `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );
   
      if (onBorrar) {
        onBorrar(cliente.id);
      }
      if (onClose) onClose();
    } catch (error) {
      if (error.response) {
        console.error('Error en la respuesta del servidor:', error.response.data);
      } else {
        console.error('Error al enviar la petición:', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-4/5 md:w-3/4 lg:w-2/3 mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Editar Cliente</h2>
      
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
      
      <div className="flex gap-4 justify-center">
        <button
          type="submit"
          className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Edit2 className="w-5 h-5" />
          Guardar Cambios
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Trash2 className="w-5 h-5" />
          Borrar Cliente
        </button>
      </div>
    </form>
  );
};

export default EditarCliente;
