"use client"

import { useEffect, useRef } from "react"

export default function BarChart({ data, maxHours = 10, selectedDay, onSelectDay }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar el tamaño del canvas
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Restablecer el canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Configuración del gráfico
    const chartHeight = rect.height - 60 // Espacio para etiquetas
    const chartWidth = rect.width
    const barWidth = (chartWidth / data.length) * 0.6
    const barSpacing = (chartWidth / data.length) * 0.4

    // Dibujar líneas horizontales de la cuadrícula
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Dibujar líneas de horas (2h, 4h, 6h, 8h, 10h)
    for (let i = 0; i <= 5; i++) {
      const y = chartHeight - ((i * 2) / maxHours) * chartHeight
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(chartWidth, y)
      ctx.stroke()

      // Etiquetas de horas en el eje Y
      ctx.fillStyle = "#9ca3af"
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${i * 2}h`, chartWidth - 8, y - 5)
    }

    // Dibujar barras
    data.forEach((item, index) => {
      const x = (index * chartWidth) / data.length + barSpacing / 2
      const barHeight = (item.hours / maxHours) * chartHeight
      const y = chartHeight - barHeight

      // Dibujar la barra
      // Barras: azul para datos, gris claro para vacías
      ctx.fillStyle = item.hours > 0
        ? (index === selectedDay
          ? "#2563EB"  // blue-600 para el día seleccionado
          : "#3B82F6"  // blue-500 para los demás días
        )
        : "#E5E7EB";   // gris claro para barras vacías
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 4)
      ctx.fill()

      // Etiqueta del día
      ctx.fillStyle = index === selectedDay ? "#3b82f6" : "#6b7280"
      ctx.font = index === selectedDay ? "bold 10px Inter, system-ui, sans-serif" : "10px Inter, system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(item.day, x + barWidth / 2, chartHeight + 16)

      // Etiqueta de la fecha
      ctx.fillStyle = "#9ca3af"
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.fillText(item.date, x + barWidth / 2, chartHeight + 32)

      // Área clickeable (invisible)
      ctx.fillStyle = "transparent"
      ctx.beginPath()
      ctx.rect(x - barSpacing / 2, 0, barWidth + barSpacing, rect.height)
      ctx.fill()
    })

    // Agregar eventos de clic
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const barWidth = rect.width / data.length
      const clickedIndex = Math.floor(x / barWidth)

      if (clickedIndex >= 0 && clickedIndex < data.length) {
        onSelectDay(clickedIndex)
      }
    }

    canvas.addEventListener("click", handleClick)

    return () => {
      canvas.removeEventListener("click", handleClick)
    }
  }, [data, maxHours, selectedDay, onSelectDay])

  return (
    <div className="w-full h-[250px] relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
