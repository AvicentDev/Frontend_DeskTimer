import React, { useContext } from 'react';
import axios from 'axios';
import useForm from '../../hooks/useForm';
import FormularioMiembro from './FormularioMiembro';
import { config } from '../../utils/config';
import { AuthContext } from '../../components/auth/AuthContext';

const AgregarMiembro = ({ onAgregar, onClose }) => {
  const { user } = useContext(AuthContext);
  const { values, handleChange, resetForm } = useForm({
    nombre: '',
    email: '',
    rol: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error('No hay usuario logueado');
      return;
    }

    const nuevoMiembro = { ...values, usuario_id: user.id };

    try {
      const response = await axios.post(
        `${config.BASE_URL}/miembros`,
        nuevoMiembro,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );

      if (onAgregar) {
        onAgregar(response.data.miembro);
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

  return (
    <FormularioMiembro 
      values={values} 
      handleChange={handleChange} 
      handleSubmit={handleSubmit} 
    />
  );
};

export default AgregarMiembro;
