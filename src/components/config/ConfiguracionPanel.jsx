"use client";
import { useState, useEffect, useContext } from "react";
import { X, User, Shield, LogOut } from "lucide-react";
import PerfilSettings from "./PerfilSettings";
import SeguridadSettings from "./SeguridadSettings";
import { AuthContext } from "../auth/AuthContext"; // Asegúrate de que la ruta es correcta

const animationStyles = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes scaleOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
  .animate-fadeIn  { animation: fadeIn 0.3s ease-out forwards; }
  .animate-fadeOut { animation: fadeOut 0.3s ease-out forwards; }
  .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
  .animate-scaleOut{ animation: scaleOut 0.3s ease-out forwards; }
`;

export const ConfiguracionPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [isClosing, setIsClosing] = useState(false);

  const { logout } = useContext(AuthContext); // Función de logout desde el contexto

  const tabs = [
    { id: "perfil", label: "Perfil", icon: <User size={18} /> },
    { id: "seguridad", label: "Seguridad", icon: <Shield size={18} /> },
    { id: "cerrar-sesion", label: "Cerrar Sesión", icon: <LogOut size={18} /> },
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleLogout = () => {
    logout(); // Ejecutar el logout del contexto de autenticación
    onClose?.(); // Cerrar el panel de configuración al hacer logout
    // Redirigir o realizar la lógica de logout según tu aplicación, por ejemplo:
    window.location.href = "/login"; // Redirigir a la página de login
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <style>{animationStyles}</style>
      <div
        className={`fixed inset-0 bg-gradient-to-br from-gray-500/20 to-blue-500/20 backdrop-blur-sm
                    flex items-center justify-center z-50 transition-all duration-300
                    ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}
      >
        <div
          className={`bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col
                      transform transition-all duration-300
                      ${isClosing ? "animate-scaleOut" : "animate-scaleIn"}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Configuración</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r bg-gray-50 p-4">
              <nav className="space-y-1" role="tablist">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                                ${activeTab === tab.id
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === "perfil" && <PerfilSettings />}
              {activeTab === "seguridad" && <SeguridadSettings />}
              {activeTab === "cerrar-sesion" && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <LogOut size={48} className="text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Cerrar sesión?</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Si cierras sesión, se cerrará tu sesión actual y tendrás que iniciar sesión nuevamente para acceder a tu cuenta.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={handleClose}
                      className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="px-5 py-2 !bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                    >
                      Confirmar cierre de sesión
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfiguracionPanel;
