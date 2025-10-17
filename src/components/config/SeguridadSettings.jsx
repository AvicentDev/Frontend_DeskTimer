import { useState, useContext } from "react";
import { Save } from "lucide-react";
import { AuthContext } from "../auth/AuthContext";
import { config } from "../../utils/config";
import axios from "axios";

export default function SeguridadSettings() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
  
    if (newPassword !== confirmPassword) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.put(
        `${config.BASE_URL}/user/${user.id}/password`,
        {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );
  
      // axios lanza por defecto excepción si status >= 400, así que aquí ya es OK
      const data = response.data;
      setMessage(data.message || "Contraseña actualizada correctamente.");
      // Limpiar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      // err.response?.data?.message contiene el mensaje de backend si existe
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error desconocido al actualizar la contraseña";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Seguridad de la cuenta</h3>

      {message && (
        <div className="p-4 text-green-800 bg-green-100 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="p-4 text-red-800 bg-red-100 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">Cambiar contraseña</h4>
          <div className="space-y-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contraseña actual"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nueva contraseña"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirmar nueva contraseña"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-4 py-2 text-sm font-medium text-white !bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} className="mr-2" />
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
