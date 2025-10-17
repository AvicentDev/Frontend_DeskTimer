"use client"

import { useEffect, useState } from "react"
import { X, AlertCircle, CheckCircle, Info } from "lucide-react"

export function Toast({ message, type = "info", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, 300) // Duración de la animación de salida
  }

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-amber-50 border-amber-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border p-4 shadow-md transition-all duration-300 ${getBackgroundColor()} ${
        isLeaving ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
      role="alert"
    >
      {getIcon()}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={handleClose} className="ml-auto rounded-full p-1 hover:bg-gray-200" aria-label="Cerrar">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
