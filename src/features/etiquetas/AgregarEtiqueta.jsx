import React, { useContext } from 'react';
import axios from 'axios';
import useForm from '../../hooks/useForm';
import FormularioEtiqueta from './FormularioEtiqueta';
import { config } from '../../utils/config';
import { AuthContext } from '../../components/auth/AuthContext';

const AgregarEtiqueta = ({ onSuccess, onClose }) => {
  const { user } = useContext(AuthContext);
  const { values, handleChange, resetForm } = useForm({
    nombre: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return console.error('No hay usuario logueado');

    try {
      const response = await axios.post(
        `${config.BASE_URL}/etiqueta`,
        { nombre: values.nombre, usuario_id: user.id },
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
      console.error('Error creando etiqueta:', error.response?.data || error.message);
    }
  };

  return (
    <FormularioEtiqueta
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default AgregarEtiqueta;
