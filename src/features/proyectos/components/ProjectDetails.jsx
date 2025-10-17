"use client";

import React, { useState, useEffect, useRef } from "react";
import TabNavigation from "../utils/TabNavigation";
import DashboardTab from "../pages/DashboardTab";
import TasksTab from "../pages/TasksTab";
import TeamTab from "../pages/TeamTab";
import ProjectMemberForm from "./ProjectMemberForm";
import useClickOutside from "../../../hooks/useClickOutside";
import axios from "axios";
import { config } from "../../../utils/config";

const ProjectDetails = ({
  project,
  setDataProyectos,
  setSelectedProyectoDetail,
  onClose,
  refreshProject,
  onNotify, // función de toasts
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [closing, setClosing] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const panelRef = useRef(null);

  useEffect(() => {
    const total = (project.entradas_tiempo || []).reduce(
      (s, e) => s + (e.duracion || 0),
      0
    );
    setTotalDuration(total);
  }, [project.entradas_tiempo]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600),
      m = Math.floor((sec % 3600) / 60),
      s = sec % 60;
    return [h, m, s].map((n) => n.toString().padStart(2, "0")).join(":");
  };

  useEffect(() => {
    requestAnimationFrame(() => setAnimateIn(true));
  }, []);

  const handleRemoveMember = async (memberId) => {
    try {
      await axios.delete(
        `${config.BASE_URL}/proyectos/${project.id}/miembros/${memberId}`,
        { headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` } }
      );
      setDataProyectos((prev) => {
        const proyectos = prev.proyectos.map((p) =>
          p.id === project.id
            ? { ...p, miembros: p.miembros.filter((m) => m.id !== memberId) }
            : p
        );
        const detalle = proyectos.find((p) => p.id === project.id);
        setSelectedProyectoDetail(detalle);
        return { ...prev, proyectos };
      });
      onNotify("Miembro eliminado correctamente", "success");
    } catch (err) {
      console.error(err);
      onNotify("Error eliminando miembro", "error");
    }
  };

  const handleClose = () => {
    if (showMemberForm) return;
    setClosing(true);
    setAnimateIn(false);
    setTimeout(onClose, 300);
  };

  useClickOutside(panelRef, handleClose);

  if (!project) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-end transition-opacity duration-300 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div
        ref={panelRef}
        className={`relative bg-gray-100 text-gray-800 shadow-lg w-full md:w-2/3 lg:w-1/2 h-full overflow-auto transform transition-transform duration-300 ${
          closing || !animateIn ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <button
          className="absolute top-4 right-4 !bg-blue-600 text-white px-3 py-1 rounded"
          onClick={handleClose}
        >
          Cerrar
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{project.nombre}</h2>
          <div className="mb-4">
            <span className="font-semibold">Horas totales: </span>
            {formatTime(totalDuration)}
          </div>
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "dashboard" && <DashboardTab project={project} />}
          {activeTab === "tasks" && <TasksTab project={project} />}
          {activeTab === "team" && (
            <TeamTab
              project={project}
              onAddMember={() => setShowMemberForm(true)}
              onRemoveMember={handleRemoveMember}
            />
          )}
        </div>
      </div>

      {showMemberForm && (
        <ProjectMemberForm
          proyectoId={project.id}
          existingMembers={project.miembros || []}
          onNotify={onNotify}
          onClose={() => setShowMemberForm(false)}
          onSubmit={(nuevoMiembro) => {
            setDataProyectos((prev) => {
              const proyectos = prev.proyectos.map((p) =>
                p.id === project.id
                  ? { ...p, miembros: [...(p.miembros || []), nuevoMiembro] }
                  : p
              );
              const detalle = proyectos.find((p) => p.id === project.id);
              setSelectedProyectoDetail(detalle);
              return { ...prev, proyectos };
            });
            onNotify("Miembro añadido correctamente", "success");
            setShowMemberForm(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
