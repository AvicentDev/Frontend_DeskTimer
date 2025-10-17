import { useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../components/auth/AuthContext'
import { config } from '../utils/config'

export default function GoogleCallback() {
  const { login } = useContext(AuthContext)
  const navigate  = useNavigate()
  const { search } = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(search)
    const token  = params.get('token')
    if (!token) {
      console.error('No llegó el token de autenticación en la URL', search)
      return
    }

    // Guarda token (si quieres)
    localStorage.setItem('token', token)

    // Recupera el usuario autenticado
    axios.get(`${config.WEB_URL}/api/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(({ data }) => {
      login(data, token)     // data es ya el objeto user
      navigate('/dashboard')
    })
    .catch(err => {
      console.error('Error al obtener perfil:', err)
    })
  }, [search, login, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-700">Procesando autenticación con Google…</p>
    </div>
  )
}
