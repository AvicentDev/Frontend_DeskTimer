import React, { useContext } from 'react';
import axios from 'axios';
import useForm from '../../hooks/useForm';
import FormularioCliente from './FormularioCliente';
import { config } from '../../utils/config';
import { AuthContext } from '../../components/auth/AuthContext';

const AgregarCliente = ({ onAgregar, onClose }) => {
  const { user } = useContext(AuthContext);
  const { values, handleChange, resetForm } = useForm({
    nombre: '',
    email: '',
    telefono: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificamos que el usuario esté logueado
    if (!user) {
      console.error('No hay usuario logueado');
      return;
    }

    const nuevoCliente = {
      ...values,
      usuario_id: user.id,
    };

    try {
      const response = await axios.post(
        `${config.BASE_URL}/clientes`,
        nuevoCliente,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );


      if (onAgregar) {
        onAgregar(response.data.cliente);
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
    <FormularioCliente
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default AgregarCliente;
