"use client"; // Next.js only, si lo necesitas

import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Animaciones
const animationStyles = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes slideOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }

  .animate-fadeIn  { animation: fadeIn 0.3s ease-out forwards; }
  .animate-fadeOut { animation: fadeOut 0.3s ease-out forwards; }
  .animate-slideIn  { animation: slideIn 0.3s ease-out forwards; }
  .animate-slideOut { animation: slideOut 0.3s ease-out forwards; }
`;

const Modal = ({ isOpen, onClose, title = "", children }) => {
  const [isClosing, setIsClosing] = useState(false);

  // Manejar cierre con animación
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      setIsClosing(false);
    }, 300);
  };

  // Evitar scroll en background
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <style>{animationStyles}</style>

      <div
        className={`
          fixed inset-0 bg-gradient-to-br from-gray-500/20 to-blue-500/20 
          backdrop-blur-sm flex items-center justify-center z-50 
          transition-all duration-300
          ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}
        `}
      >
        <div
          className={`
            bg-white rounded-lg shadow-xl w-full max-w-md transform
            transition-all duration-300 
            ${isClosing ? "animate-slideOut" : "animate-slideIn"}
          `}
        >
          {/* Header con título dinámico */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {title}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
