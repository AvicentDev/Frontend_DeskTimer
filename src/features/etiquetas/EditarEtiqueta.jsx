import React, { useContext } from 'react';
import axios from 'axios';
import useForm from '../../hooks/useForm';
import { Edit2, Trash2 } from 'lucide-react';
import { config } from '../../utils/config';
import { AuthContext } from '../../components/auth/AuthContext';

const EditarEtiqueta = ({ etiqueta, onSuccess, onClose }) => {
  const { user } = useContext(AuthContext);
  const { values, handleChange, resetForm } = useForm({
    nombre: etiqueta?.nombre || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return console.error('No hay usuario logueado');

    try {
      const response = await axios.put(
        `${config.BASE_URL}/etiqueta/${etiqueta.id}`,
        { nombre: values.nombre },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );
      onSuccess(response.data.etiqueta);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error actualizando etiqueta:', error.response?.data || error.message);
    }
  };

  const handleDelete = async () => {
    if (!user) return console.error('No hay usuario logueado');

    try {
      await axios.delete(
        `${config.BASE_URL}/etiqueta/${etiqueta.id}`,
        { headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` } }
      );
      onSuccess({ deletedId: etiqueta.id });
      onClose();
    } catch (error) {
      console.error('Error eliminando etiqueta:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-4/5 md:w-3/4 lg:w-2/3 mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Editar Etiqueta</h2>

      <div>
        <label htmlFor="nombre" className="block text-gray-600">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={values.nombre}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholder="Nombre de la etiqueta"
          required
        />
      </div>

      <div className="flex gap-4 justify-center">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 !bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Edit2 className="w-5 h-5" /> Guardar Cambios
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 !bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Trash2 className="w-5 h-5" /> Eliminar Etiqueta
        </button>
      </div>
    </form>
  );
};

export default EditarEtiqueta;
