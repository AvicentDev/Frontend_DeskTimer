import React, { useContext } from 'react';
import axios from 'axios';
import useForm from '../../hooks/useForm';
import { Edit2, Trash2 } from 'lucide-react';
import { config } from '../../utils/config';
import { AuthContext } from '../../components/auth/AuthContext';

const EditarMiembro = ({ miembro, onEditar, onBorrar, onClose }) => {
  const { user } = useContext(AuthContext);
  // Inicializamos con 'rol' en lugar de 'telefono'
  const { values, handleChange, resetForm } = useForm({
    nombre: miembro.nombre || '',
    email: miembro.email || '',
    rol: miembro.rol || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('No hay usuario logueado');
      return;
    }
    const updatedMiembro = {
      ...values,
      usuario_id: user.id,
    };
    try {
      const response = await axios.put(
        `${config.BASE_URL}/miembros/${miembro.id}`,
        updatedMiembro,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );

      if (onEditar) {
        onEditar(response.data.miembro);
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
        `${config.BASE_URL}/miembros/${miembro.id}`,
        {
          headers: {
            'Authorization': `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );

      if (onBorrar) {
        onBorrar(miembro.id);
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
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Editar Miembro</h2>
      
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
          Borrar Miembro
        </button>
      </div>
    </form>
  );
};

export default EditarMiembro;
