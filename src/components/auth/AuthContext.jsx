import { createContext, useState, useEffect } from "react";
import { config } from "../../utils/config";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      validateToken(storedToken).then((isValid) => {
        if (isValid) {
          setUser(JSON.parse(storedUser));
        } else {
          logout();
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Validar el token con el backend
  async function validateToken(token) {
    try {
      const response = await fetch(`${config.BASE_URL}/validate-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.AUTH_TOKEN}`,
        },
      });

      if (!response.ok) return false;

      const data = await response.json();
      return data.valid;
    } catch {
      return false;
    }
  }

  function login(userData, token) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  }

async function logout() {
  const storedEntry = localStorage.getItem("activeEntry");
  const activeEntryObj = storedEntry ? JSON.parse(storedEntry) : null;

  if (activeEntryObj) {
    const url = `${config.BASE_URL}/entrada_tiempo/detener/${activeEntryObj.id}`;
    console.log("Deteniendo entrada de tiempo en:", url);

    try {
      const response = await axios.patch(
        url,
        { descripcion: "Cierre de sesión - cronómetro detenido automáticamente." },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Entrada detenida, respuesta:", response.status, response.data);
    } catch (error) {
      console.error(
        "❌ Error al detener la entrada activa:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
  }

  // Limpiar estado y localStorage
  setUser(null);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("activeEntry");
  localStorage.removeItem("activeProject");
  localStorage.removeItem("timerStart");
}





  // 🔥 Nueva función para actualizar el usuario
  function updateUser(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }


  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
