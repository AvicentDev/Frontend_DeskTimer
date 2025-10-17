// src/app/routes/.../AgregarProyecto.jsx
"use client"

import React, { useContext } from "react"
import axios from "axios"
import useForm from "../../../hooks/useForm"
import useClientes from "../../../hooks/useClientes"
import FormularioProyecto from "../components/FormularioProyecto"
import { config } from "../../../utils/config"
import { AuthContext } from "../../../components/auth/AuthContext"

const AgregarProyecto = ({ onAgregar, onClose }) => {
  const { user } = useContext(AuthContext)
  const { clientes } = useClientes()
  const { values, handleChange, resetForm } = useForm({
    nombre: "",
    descripcion: "",
    tiempoEstimado: "",
    fechaEntrega: "",
    estado: "",
    prioridad: "",
    cliente: "",
    color: "#2196F3",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      console.error("No hay usuario logueado")
      return
    }

    // Asegurarnos de que tiempoEstimado es un entero
    const horas = parseInt(values.tiempoEstimado, 10)
    if (isNaN(horas)) {
      alert("El campo Tiempo Estimado debe ser un número entero de horas.")
      return
    }

    const payload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      tiempo_estimado: horas,
      fecha_entrega: values.fechaEntrega,
      estado: values.estado,
      prioridad: values.prioridad,
      cliente_id: Number(values.cliente),
      usuario_id: user.id,
      color: values.color,
    }

    try {
      const { data } = await axios.post(
        `${config.BASE_URL}/proyectos`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      )

      // Enriquecer con el objeto cliente para que aparezca inmediatamente
      const proyectoBackend = data.proyecto
      const clienteObj = clientes.find(c => c.id === Number(proyectoBackend.cliente_id)) || null

      const newProyecto = {
        ...proyectoBackend,
        cliente: clienteObj,
      }

      onAgregar(newProyecto)
      resetForm()
      onClose?.()
    } catch (err) {
      console.error("Error al crear:", err.response?.data || err.message)
      alert("Error: " + (err.response?.data?.message || "Comprueba los datos"))
    }
  }

  return (
    <FormularioProyecto
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      onClose={onClose}
    />
  )
}

export default AgregarProyecto
