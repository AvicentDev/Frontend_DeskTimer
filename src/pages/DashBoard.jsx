"use client";
import React, { useState, useContext, useEffect } from "react";
import { Calendar, Users, User, Box, ClipboardList, List, Tag } from "lucide-react";
import Sidebar from "../components/layouts/SideBar";
import { ContentRouter } from "../routes/ContentRouter";
import Navbar from "../components/layouts/NavBar";
import { AuthContext } from "../components/auth/AuthContext";
import { ConfiguracionPanel } from "../components/config/ConfiguracionPanel";
import { getProyectos } from "../data/ProyectoData";

const menuItems = [
  { id: "calendario", label: "Calendario", icon: <Calendar size={20} /> },
  { id: "clientes", label: "Clientes", icon: <Users size={20} /> },
  { id: "miembros", label: "Miembros", icon: <User size={20} /> },
  { id: "workspace", label: "WorkSpace", icon: <Box size={20} /> },
  { id: "solicitudes", label: "Solicitudes", icon: <ClipboardList size={20} /> },
  { id: "etiquetas", label: "Etiquetas", icon: <Tag size={20} /> },
];

const DashboardPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("calendario");
  const { user } = useContext(AuthContext);

  const [projectsData, setProjectsData] = useState({ proyectos: [] });
  const [selectedProyectoDetail, setSelectedProyectoDetail] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProyectos();
        setProjectsData({ proyectos: data.proyectos });
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
      }
    }
    fetchProjects();
  }, []);

  const refreshProject = (projectId, newEntry) => {
    setProjectsData((prevState) => {
      const updatedProjects = prevState.proyectos.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            entradas_tiempo: [...(proj.entradas_tiempo || []), newEntry],
          };
        }
        return proj;
      });
      return { ...prevState, proyectos: updatedProjects };
    });
    setSelectedProyectoDetail((prev) => {
      if (prev && prev.id === projectId) {
        return {
          ...prev,
          entradas_tiempo: [...(prev.entradas_tiempo || []), newEntry],
        };
      }
      return prev;
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      <Sidebar
        isOpen={isOpen}
        menuItems={menuItems}
        activeItem={activeItem}
        onItemClick={setActiveItem}
        onOpenConfigPanel={() => setShowConfigPanel(true)}
        onToggleSidebar={() => setIsOpen(!isOpen)}
      />
      <div className="flex-1 flex flex-col">
        <Navbar
          user={user}
          setActiveItem={setActiveItem}
          refreshProject={refreshProject}
        />
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <ContentRouter
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            projectsData={projectsData}
            setProjectsData={setProjectsData}
            refreshProject={refreshProject}
            selectedProyectoDetail={selectedProyectoDetail}
            setSelectedProyectoDetail={setSelectedProyectoDetail}
          />
        </div>
      </div>
      {showConfigPanel && (
        <ConfiguracionPanel onClose={() => setShowConfigPanel(false)} />
      )}
    </div>
  );
};

export default DashboardPage;
