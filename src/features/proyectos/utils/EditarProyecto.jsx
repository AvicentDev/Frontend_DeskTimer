// src/app/routes/.../EditarProyecto.jsx
"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import FormularioProyecto from "../components/FormularioProyecto"
import { config } from "../../../utils/config"

const EditarProyecto = ({ proyecto, onEditar, onBorrar, onClose }) => {
  // Normaliza el valor inicial a un entero de horas
  const normalizeInitialTime = (te) => {
    if (te == null) return 0
    if (typeof te === "number") {
      return Math.floor(te)
    }
    // si viene como string "HH:MM:SS" o "HH:MM"
    const parts = te.split(":").map(Number)
    if (parts.length < 1 || parts.some(isNaN)) return 0
    return Math.floor(parts[0])
  }

  const [values, setValues] = useState({
    nombre: proyecto.nombre || "",
    descripcion: proyecto.descripcion || "",
    tiempoEstimado: normalizeInitialTime(proyecto.tiempo_estimado),
    fechaEntrega: proyecto.fecha_entrega || "",
    estado: proyecto.estado || "",
    prioridad: proyecto.prioridad || "",
    cliente: proyecto.cliente ? proyecto.cliente.id : "",
    color: proyecto.color || "#2196F3",
  })

  useEffect(() => {
    setValues({
      nombre: proyecto.nombre || "",
      descripcion: proyecto.descripcion || "",
      tiempoEstimado: normalizeInitialTime(proyecto.tiempo_estimado),
      fechaEntrega: proyecto.fecha_entrega || "",
      estado: proyecto.estado || "",
      prioridad: proyecto.prioridad || "",
      cliente: proyecto.cliente ? proyecto.cliente.id : "",
      color: proyecto.color || "#2196F3",
    })
  }, [proyecto])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({
      ...prev,
      // para tiempoEstimado, aseguramos entero
      [name]:
        name === "tiempoEstimado"
          ? Math.max(0, parseInt(value, 10) || 0)
          : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Enviamos directamente un entero
    const payload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      estado: values.estado,
      prioridad: values.prioridad,
      cliente_id: values.cliente,
      fecha_entrega: values.fechaEntrega,
      tiempo_estimado: values.tiempoEstimado,
      color: values.color,
    }

    try {
      const { data } = await axios.put(
        `${config.BASE_URL}/proyectos/${proyecto.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      )

      const proyectoBackend = data.proyecto
      const editedProyecto = {
        ...proyectoBackend,
        // el padre resolverá el objeto cliente
        cliente: proyectoBackend.cliente_id,
        miembros: proyecto.miembros,
        color: proyectoBackend.color,
      }

      onEditar(editedProyecto)
      onClose()
    } catch (err) {
      console.error("Error al actualizar:", err)
      alert("Error: " + (err.response?.data?.message || "Comprueba los datos"))
    }
  }

  return (
    <FormularioProyecto
      title="Editar Proyecto"
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      onBorrar={() => onBorrar(proyecto.id)}
      onClose={onClose}
    />
  )
}

export default EditarProyecto
