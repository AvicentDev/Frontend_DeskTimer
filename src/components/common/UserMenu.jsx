import React, { useState, useRef, useEffect, useContext } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext'; // Asegúrate de la ruta correcta
import { useNavigate } from 'react-router-dom';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useContext(AuthContext); // Obtén la función logout desde el contexto
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/login');
  };

  const handleProfileSettings = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button 
        onClick={toggleDropdown} 
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Menú de usuario"
      >
        <User size={20} className="text-gray-700" />
      </button>

      {/* Dropdown Menu - Flotante */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
          style={{ 
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">Mi cuenta</p>
          </div>
          
          {/* Menu Items */}
          <div className="py-1">
            <button
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={handleProfileSettings}
            >
              <Settings size={16} className="mr-2" />
              Ajustes de perfil
            </button>
            
            <button
              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// CSS opcional para la animación (puedes añadirlo a tu archivo CSS)
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(-10px); }
//   to { opacity: 1; transform: translateY(0); }
// }