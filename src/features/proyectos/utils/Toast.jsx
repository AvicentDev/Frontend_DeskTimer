"use client"
import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

export const Toast = ({ message, type = "success", onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose()
      }, 300) // Tiempo para la animación de salida
    }, 3000) // Duración del toast

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "error":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getStyles = () => {
    const baseStyles =
      "flex items-center p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 mb-2"

    const typeStyles = {
      success: "bg-green-600",
      error: "bg-red-600",
      info: "bg-blue-600",
    }

    const visibilityStyles = isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"

    return `${baseStyles} ${typeStyles[type]} ${visibilityStyles}`
  }

  return (
    <div className={getStyles()}>
      <div className="flex items-center">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 mr-4">
          <p className="text-sm font-medium">
            {typeof message === "string" ? message : message?.message || "Ha ocurrido un error"}
          </p>

        </div>
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose(), 300)
        }}
        className="ml-auto bg-transparent text-black hover:text-gray-200 focus:outline-none"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col-reverse">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

export default Toast

