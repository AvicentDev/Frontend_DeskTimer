"use client"
import React, { useContext, useState } from "react"
import { MenuButton } from "../common/MenuButton"
import { UserMenu } from "../common/UserMenu"
import { menuSections } from "../common/MenuSections"
import { useLocation } from "react-router-dom"
import { AuthContext } from "../auth/AuthContext"
import { Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react"

const Sidebar = ({ isOpen, activeItem, onItemClick, onOpenConfigPanel, onToggleSidebar }) => {
  const location = useLocation()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useContext(AuthContext)
  const isAdmin = user?.rol === "administrador"

  return (
    <div
      className={`bg-white text-gray-800 transition-all duration-300 shadow-lg ${isOpen ? "w-64" : "w-20"
        } relative z-10 h-full`}
    >
      {/* Botón de toggle */}
      <button
        onClick={onToggleSidebar}
        className={`sidebar-toggle ${isOpen ? "sidebar-toggle-open" : "sidebar-toggle-closed"
          }`}
        style={{
          top: "calc(50% - 20px)", // Esto coloca el botón en el centro
        }}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>


      {/* Encabezado del Sidebar */}
      <div className="flex items-center justify-center px-6 py-4 border-b border-gray-100">
        <div
          className={`bg-blue-600 text-white p-2 rounded-md shadow-md transition-all ${isOpen ? "w-32" : "w-10"
            } flex items-center justify-center`}
        >
          {isOpen ? "DeskTimer" : "DT"}
        </div>
      </div>

      {/* Menú principal */}
      <nav className="mt-6 px-4 space-y-6">
        {menuSections.map((section) => (
          <div key={section.sectionTitle} className="space-y-2">
            <div
              className={`text-xs font-semibold uppercase text-gray-500 mb-2 ${!isOpen && "hidden"
                }`}
            >
              {section.sectionTitle}
            </div>
            {section.items.map((item) => (
              <MenuButton
                key={item.id}
                item={item}
                isOpen={isOpen}
                isActive={activeItem === item.id}
                onClick={() => onItemClick(item.id)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Área inferior: UserMenu y botón de configuración */}
      <div
        className={`absolute bottom-0 w-full px-4 py-2 flex items-center ${isOpen ? "justify-center gap-4" : "flex-col gap-2"
          }`}
      >

        {/* Botón de configuración */}
        <button
          onClick={onOpenConfigPanel}
          className="flex items-center justify-center bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100"
        >
          <Settings size={18} className="text-gray-700" />
        </button>
      </div>


    </div>
  )
}

export default Sidebar
