// src/pages/AuthComponents.jsx

import { useContext, useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../components/auth/AuthContext"
import { config } from "../utils/config"

// Esquema de validación con Zod incluyendo el rol
const formSchema = z
  .object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Por favor, introduce un email válido" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, { message: "Debes aceptar los términos y condiciones" }),
    rol: z.enum(["empleado", "administrador"], { required_error: "Debes seleccionar un rol" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export default function Register() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])

  // Controles de animación para el reloj
  const secondHandControls = useAnimation()
  const minuteHandControls = useAnimation()
  const hourHandControls = useAnimation()

  useEffect(() => {
    // Generar partículas
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)

    // Animaciones continuas del reloj
    secondHandControls.start({
      rotate: 360,
      transition: { duration: 60, ease: "linear", repeat: Infinity },
    })
    minuteHandControls.start({
      rotate: 360,
      transition: { duration: 3600, ease: "linear", repeat: Infinity },
    })
    hourHandControls.start({
      rotate: 360,
      transition: { duration: 43200, ease: "linear", repeat: Infinity },
    })
  }, [secondHandControls, minuteHandControls, hourHandControls])

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
      rol: "empleado",
    },
  })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    })
  }

  const onSubmit = async (values) => {
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    console.log("📤 Enviando datos al backend:", {
      name: values.name,
      email: values.email,
      password: "***hidden***",
      rol: values.rol,
    })

    try {
      const response = await axios.post(
        `${config.BASE_URL}/register`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          rol: values.rol,
        }
      )
      
      console.log("✅ Respuesta del backend:", response)
      console.log("📦 Datos de respuesta:", response.data)
      const data = response.data

      // Verificar si la respuesta es exitosa
      if (response.status === 200 || response.status === 201) {
        // El token puede estar en data.access_token o data.token
        const token = data.access_token || data.token
        // Los datos del usuario pueden estar en data.data, data.user o directamente en data
        const userData = data.data || data.user || data
        
        console.log("🔑 Token encontrado:", token ? "Sí" : "No")
        console.log("👤 Usuario encontrado:", userData)
        
        if (token && userData) {
          login(userData, token)
          setSuccessMessage("¡Registro exitoso! Redirigiendo...")
          // Redirección inmediata después del login
          navigate("/dashboard", { replace: true })
        } else {
          setError("Respuesta del servidor incompleta. Token o datos de usuario no encontrados.")
          console.error("❌ Estructura de respuesta inesperada:", data)
        }
      } else {
        setError(data.message || "Error al registrar usuario")
      }
    } catch (err) {
      console.error("❌ Error de registro:", err)
      
      // Mostrar el error específico del backend
      if (err.response) {
        console.error("📥 Respuesta del backend:", err.response.data)
        console.error("📊 Status code:", err.response.status)
        
        // Si el backend devolvió un mensaje de error
        if (err.response.data?.error) {
          setError(`Error: ${err.response.data.error}`)
        } else if (err.response.data?.message) {
          setError(err.response.data.message)
        } else if (err.response.data?.errors) {
          // Errores de validación
          const errores = Object.values(err.response.data.errors).flat()
          setError(errores.join(", "))
        } else {
          setError("Error del servidor. Por favor, inténtalo de nuevo.")
        }
      } else if (err.request) {
        console.error("📡 No hubo respuesta del servidor")
        setError("No se pudo conectar con el servidor. Verifica tu conexión.")
      } else {
        console.error("⚠️ Error configurando la petición:", err.message)
        setError("Error de conexión. Por favor, inténtalo de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    // Redirige al backend para iniciar OAuth con Google
    window.location.href = `${config.WEB_URL}/auth/google/redirect`
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="grid w-full max-w-[1200px] gap-6 rounded-xl bg-white p-4 shadow-lg md:grid-cols-2 md:gap-12 md:p-10 lg:p-12">
        {/* Formulario de registro */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center space-y-6"
        >
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold tracking-tight md:text-4xl"
            >
              Crear una cuenta
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-500"
            >
              Introduce tus datos para crear una cuenta nueva.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && <div className="rounded-md bg-red-100 p-3 text-red-700">{error}</div>}
              {successMessage && <div className="rounded-md bg-green-100 p-3 text-green-700">{successMessage}</div>}

              {/* Nombre */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    className={`w-full rounded-md border ${errors.name ? "border-red-500" : "border-gray-300"} py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    {...formRegister("name")}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    className={`w-full rounded-md border ${errors.email ? "border-red-500" : "border-gray-300"} py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    {...formRegister("email")}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full rounded-md border ${errors.password ? "border-red-500" : "border-gray-300"} py-2.5 pl-10 pr-12 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    {...formRegister("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                    !absolute !right-2 !top-2 
                    !rounded-md 
                    !border !border-gray-200 
                    !bg-transparent 
                    !p-1"
                  >
                    {showPassword
                      ? <EyeOff className="!h-4 !w-4 !text-gray-400" />
                      : <Eye className="!h-4 !w-4 !text-gray-400" />
                    }
                    <span className="sr-only">
                      {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    </span>
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              
              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full rounded-md border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} py-2.5 pl-10 pr-12 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    {...formRegister("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="!absolute !right-2 !top-2 !rounded-md !border !border-gray-200 !bg-transparent !p-1"
                  >
                    {showConfirmPassword
                      ? <EyeOff className="!h-4 !w-4 !text-gray-400" />
                      : <Eye className="!h-4 !w-4 !text-gray-400" />}
                    <span className="sr-only">
                      {showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    </span>
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>


              {/* Selección de rol */}
              <div className="space-y-2">
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                  Selecciona un rol
                </label>
                <select
                  id="rol"
                  className={`w-full rounded-md border ${errors.rol ? "border-red-500" : "border-gray-300"} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  {...formRegister("rol")}
                >
                  <option value="empleado">Empleado</option>
                  <option value="administrador">Administrador</option>
                </select>
                {errors.rol && <p className="text-sm text-red-500">{errors.rol.message}</p>}
              </div>

              {/* Términos y condiciones */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...formRegister("terms")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    Acepto los{" "}
                    <a href="/terms" className="font-semibold text-blue-600 hover:text-blue-500">
                      términos y condiciones
                    </a>
                  </label>
                  {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>}
                </div>
              </div>

              {/* Botón de crear cuenta */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md !bg-blue-600 py-2 px-4 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </div>
                ) : (
                  "Crear cuenta"
                )}
              </button>
            </form>

            {/* Separador y registro con Google */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">O regístrate con</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  {/* SVG paths unchanged */}
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
              )}
              <span>{isLoading ? "Conectando..." : "Continuar con Google"}</span>
            </button>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                Inicia sesión
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Panel derecho con animaciones y logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden rounded-lg bg-gradient-to-br from-blue-600 to-indigo-900 md:flex md:items-center md:justify-center overflow-hidden relative"
          onMouseMove={handleMouseMove}
        >
          {/* Background glow effect */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-3xl"
            animate={{
              x: mousePosition.x * 0.05,
              y: mousePosition.y * 0.05,
            }}
            transition={{ type: "spring", damping: 10 }}
          />

          {/* Floating particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white"
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: [particle.x, particle.x + (Math.random() * 60 - 30)],
                y: [particle.y, particle.y + (Math.random() * 60 - 30)],
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: particle.delay,
                ease: "easeInOut",
              }}
              style={{
                width: particle.size,
                height: particle.size,
              }}
            />
          ))}

          {/* Main logo container */}
          <motion.div
            className="flex flex-col items-center justify-center z-10 p-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Modern clock design */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                delay: 0.5,
                duration: 0.8,
              }}
              style={{
                x: mousePosition.x * 0.02,
                y: mousePosition.y * 0.02,
              }}
            >
              {/* Outer ring with gradient */}
              <motion.div
                className="w-[160px] h-[160px] rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 120, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
              >
                {/* Inner circle */}
                <motion.div
                  className="w-[140px] h-[140px] rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.8) 100%)",
                    boxShadow: "inset 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 4px 12px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Clock face */}
                  <motion.div
                    className="w-[120px] h-[120px] rounded-full flex items-center justify-center relative"
                    style={{
                      background: "linear-gradient(135deg, rgba(30, 64, 175, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)",
                      boxShadow: "inset 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {/* Clock markers */}
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 bg-white opacity-70"
                        style={{
                          height: i % 3 === 0 ? "8px" : "4px",
                          transformOrigin: "50% 60px",
                          transform: `rotate(${i * 30}deg) translateY(-54px)`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ delay: 0.8 + i * 0.05 }}
                      />
                    ))}

                    {/* Digital time display */}
                    <motion.div
                      className="absolute top-[35px] text-white text-xs font-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      10:25
                    </motion.div>

                    {/* Second hand */}
                    <motion.div
                      className="absolute w-[1px] h-[50px] bg-red-500"
                      style={{
                        transformOrigin: "bottom center",
                        bottom: "60px",
                      }}
                      initial={{ rotate: 0 }}
                      animate={secondHandControls}
                    />

                    {/* Minute hand */}
                    <motion.div
                      className="absolute w-[2px] h-[40px] bg-white rounded-full"
                      style={{
                        transformOrigin: "bottom center",
                        bottom: "60px",
                      }}
                      initial={{ rotate: 50 }}
                      animate={minuteHandControls}
                    />

                    {/* Hour hand */}
                    <motion.div
                      className="absolute w-[3px] h-[25px] bg-white rounded-full"
                      style={{
                        transformOrigin: "bottom center",
                        bottom: "60px",
                      }}
                      initial={{ rotate: 300 }}
                      animate={hourHandControls}
                    />

                    {/* Center dot */}
                    <motion.div
                      className="absolute w-[8px] h-[8px] rounded-full bg-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Logo Text with modern styling */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              style={{
                x: mousePosition.x * 0.01,
                y: mousePosition.y * 0.01,
              }}
            >
              <motion.h1
                className="text-4xl font-bold tracking-tight text-white"
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, letterSpacing: "0.05em" }}
                transition={{ duration: 1, delay: 1.4 }}
              >
                <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                  Desk
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Timer</span>
              </motion.h1>

              <motion.div
                className="relative mt-2"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <div className="h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
              </motion.div>

              <motion.p
                className="mt-3 text-sm font-light tracking-wider text-blue-100 uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                Maximize your productivity
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// Componente para procesar el callback de Google en la SPA
export function GoogleCallback() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const { search } = useLocation()

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}/auth/google/callback${search}`)
      .then(({ data }) => {
        if (data.access_token) {
          login(data.data, data.access_token)
          navigate("/dashboard")
        } else {
          console.error("Callback sin token:", data)
        }
      })
      .catch((err) => console.error("Error en callback Google:", err))
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-700">Procesando autenticación con Google...</p>
    </div>
  )
}