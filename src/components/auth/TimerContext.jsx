"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { config } from "../../utils/config";
import { AuthContext } from "../auth/AuthContext"; // Ajusta la ruta segun tu estructura

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Obtenemos el usuario del AuthContext
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0); // tiempo en segundos
  const [activeEntry, setActiveEntry] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  // Cargar datos iniciales del localStorage al montar el componente
  useEffect(() => {
    const savedEntry = localStorage.getItem("activeEntry");
    const savedProject = localStorage.getItem("activeProject");
    const savedTimerStart = localStorage.getItem("timerStart");

    if (savedEntry && savedProject && savedTimerStart) {
      const entry = JSON.parse(savedEntry);
      const project = JSON.parse(savedProject);
      const startTimestamp = parseInt(savedTimerStart, 10);
      const elapsedTime = Math.floor((Date.now() - startTimestamp) / 1000);

      setActiveEntry(entry);
      setActiveProject(project);
      setIsTimerRunning(true);
      setTime(elapsedTime);
    }
  }, []);

  // Actualiza el contador mientras el timer está corriendo
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Este useEffect reinicializa el estado del timer si el usuario es null (logout o cambio)
  useEffect(() => {
    if (!user) {
      setActiveEntry(null);
      setActiveProject(null);
      setIsTimerRunning(false);
      setTime(0);

      localStorage.removeItem("activeEntry");
      localStorage.removeItem("activeProject");
      localStorage.removeItem("timerStart");
    }
  }, [user]);

  const startTimer = async (proyecto) => {
    if (!proyecto?.id) {
      console.error("El proyecto no tiene un ID válido.");
      return;
    }

    try {
      const response = await fetch(`${config.BASE_URL}/entrada_tiempo/iniciar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.AUTH_TOKEN}`,
        },
        body: JSON.stringify({ proyecto_id: proyecto.id }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error al iniciar cronómetro. Datos:", errorData);
        throw new Error("Error al iniciar el cronómetro");
      }

      const data = await response.json();
      const startTimestamp = Date.now();

      setActiveEntry(data.entrada_tiempo);
      setActiveProject(proyecto);
      setIsTimerRunning(true);
      setTime(0);

      localStorage.setItem("activeEntry", JSON.stringify(data.entrada_tiempo));
      localStorage.setItem("activeProject", JSON.stringify(proyecto));
      localStorage.setItem("timerStart", startTimestamp.toString());
    } catch (error) {
      console.error("Error en startTimer:", error);
    }
  };

  const stopTimer = async (descripcion = "", callback) => {
    if (!activeEntry) {
      console.warn("No hay entrada activa para detener.");
      return;
    }

    try {
      const response = await fetch(
        `${config.BASE_URL}/entrada_tiempo/detener/${activeEntry.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.AUTH_TOKEN}`,
          },
          body: JSON.stringify({ descripcion }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al detener cronómetro. Datos:", errorData);

        if (
          response.status === 400 &&
          errorData.message.includes("ya fue detenido")
        ) {
          console.warn("El cronómetro ya estaba detenido. Reseteando estado en frontend...");
          setActiveEntry(null);
          setActiveProject(null);
          setIsTimerRunning(false);
          setTime(0);

          localStorage.removeItem("activeEntry");
          localStorage.removeItem("activeProject");
          localStorage.removeItem("timerStart");
          return;
        }

        throw new Error("Error al detener el cronómetro");
      }

      const data = await response.json();

      if (callback && typeof callback === "function") {
        callback(data.entrada_tiempo);
      }

      setActiveEntry(null);
      setActiveProject(null);
      setIsTimerRunning(false);
      setTime(0);

      localStorage.removeItem("activeEntry");
      localStorage.removeItem("activeProject");
      localStorage.removeItem("timerStart");
    } catch (error) {
      console.error("Error en stopTimer:", error);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        time,               // tiempo en segundos
        isTimerRunning,
        activeEntry,        // para identificar el evento activo
        activeProject,
        startTimer,
        stopTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
