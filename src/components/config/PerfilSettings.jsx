"use client";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Save } from "lucide-react";
import { config } from "../../utils/config";

const PerfilSettings = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Sin rol ya no hay que manejar ese campo
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar cambios en el backend
  const handleUpdate = async () => {
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${config.BASE_URL}/user/${user.id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setMessage("Usuario actualizado correctamente.");
      } else {
        // Backend puede devolver un mensaje específico
        const msg = data.message || "Ocurrió un error al actualizar.";
        setError(msg.includes("correo electrónico ya está en uso")
          ? "Este correo ya existe en el sistema. Por favor, use otro."
          : msg
        );
      }
    } catch (err) {
      console.error("Error al actualizar usuario", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Información de perfil</h3>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="flex items-center px-4 py-2 text-sm font-medium text-white !bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} className="mr-2" />
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
};

export default PerfilSettings;
