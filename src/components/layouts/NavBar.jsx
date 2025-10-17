import axios from "axios";
import { Pause, Play, Search } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "../../components/auth/TimerContext";
import NotificationSystem from "../../features/solicitudes_entradaTiempo/NotificationSystem/NotificationSystem";
import useEtiquetas from "../../hooks/useEtiquetas";
import useProyectos from "../../hooks/useProyectos";
import { config } from "../../utils/config";
// Asegúrate de instalar lodash: npm install lodash
import debounce from "lodash/debounce";

// ✅ Import corregido: la D de Down debe ser mayúscula
import TagDropDown from "../common/TagDropDown";

const Navbar = ({ user, setActiveItem, refreshProject }) => {
  const {
    time,
    isTimerRunning,
    activeProject,
    activeEntry,
    startTimer,
    stopTimer,
  } = useTimer();
  const { projects, loading, error, refreshProjects } = useProyectos();
  const { etiquetas, loading: loadingTags, refreshEtiquetas } = useEtiquetas();

  const [showProjects, setShowProjects] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef(null);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  // Carga la descripción y etiquetas del entry activo
  useEffect(() => {
    if (!activeEntry?.id) return;
    setDescription(activeEntry.descripcion || "");
    setSelectedTagIds([]);
    axios
      .get(`${config.BASE_URL}/entrada_tiempo/${activeEntry.id}/etiquetas`, {
        headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
      })
      .then((res) => {
        const ids = Array.isArray(res.data) ? res.data.map((t) => t.id) : [];
        setSelectedTagIds(ids);
      })
      .catch((err) => console.error(err));
  }, [activeEntry?.id]);

  const patchDescription = useCallback(
    debounce(async (id, desc) => {
      try {
        await axios.patch(
          `${config.BASE_URL}/entrada_tiempo/${id}`,
          { descripcion: desc },
          { headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` } }
        );
        if (refreshProject && activeProject) {
          refreshProject(activeProject.id, { id, descripcion: desc });
        }
      } catch (err) {
        console.error("[Frontend] ❌ Error en patchDescription:", err);
      }
    }, 500),
    [refreshProject, activeProject]
  );

  const formatTime = (s) => {
    const secs = Math.floor(s);
    const h = String(Math.floor(secs / 3600)).padStart(2, "00");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "00");
    const sec = String(secs % 60).padStart(2, "00");
    return `${h}:${m}:${sec}`;
  };

  const handleSearchClick = () => {
    if (!isTimerRunning) {
      setShowProjects(true);
      refreshProjects();
    }
  };

  const handleProjectClick = (proj) => {
    startTimer(proj);
    setShowProjects(false);
    setSearchText("");
  };

  const handleTimerButton = () => {
    if (isTimerRunning && activeProject) {
      if (activeEntry?.id) patchDescription.flush();

      const newEntry = {
        id: Date.now(),
        duracion: time,
        descripcion: description,
      };
      if (refreshProject) refreshProject(activeProject.id, newEntry);

      stopTimer(description, () => {});
      setDescription("");
    } else {
      handleSearchClick();
      refreshProjects();
    }
  };

  const handleTagChange = async (newIds) => {
    if (!activeEntry?.id) return;
    const removedIds = selectedTagIds.filter((id) => !newIds.includes(id));
    const addedIds = newIds.filter((id) => !selectedTagIds.includes(id));

    try {
      if (removedIds.length) {
        await axios.delete(
          `${config.BASE_URL}/entrada_tiempo/${activeEntry.id}/etiquetas`,
          {
            data: { etiqueta_ids: removedIds },
            headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` },
          }
        );
      }
      if (addedIds.length) {
        await axios.patch(
          `${config.BASE_URL}/entrada_tiempo/${activeEntry.id}/etiquetas`,
          {
            etiqueta_ids: newIds,
          },
          { headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` } }
        );
      }

      setSelectedTagIds(newIds);
      refreshEtiquetas();
      const nuevasEtiquetas = etiquetas.filter((t) => newIds.includes(t.id));
      if (refreshProject) {
        refreshProject(activeProject.id, {
          id: activeEntry.id,
          etiquetas: nuevasEtiquetas,
        });
      }
    } catch (err) {
      console.error("🏷️ Error sincronizando etiquetas:", err);
    }
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowProjects(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <nav className="bg-white h-20 px-9 flex items-center justify-between shadow-sm border-b border-gray-100">
      <div className="flex-1 max-w-xl relative" ref={inputRef}>
        <input
          type="text"
          placeholder={
            isTimerRunning ? "Añade descripción..." : "¿En qué trabajas?"
          }
          className="w-full border rounded-full py-3 px-5 pl-12 focus:ring-2 focus:ring-blue-400"
          value={isTimerRunning ? description : searchText}
          onChange={(e) => {
            if (isTimerRunning) {
              setDescription(e.target.value);
              if (activeEntry?.id)
                patchDescription(activeEntry.id, e.target.value);
            } else setSearchText(e.target.value);
          }}
          onClick={handleSearchClick}
        />
        {!isTimerRunning && (
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
        )}
        {!isTimerRunning && showProjects && (
          <div className="absolute left-0 right-0 bg-white border rounded-lg mt-1 shadow-lg z-10">
            {loading && (
              <p className="p-3 text-gray-500">Cargando proyectos...</p>
            )}
            {error && <p className="p-3 text-red-500">Error: {error}</p>}
            {!loading &&
              !error &&
              projects.map((p) => (
                <div
                  key={p.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleProjectClick(p)}
                >
                  {p.nombre}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        {activeProject && isTimerRunning && (
          <div className="inline-flex items-center space-x-2">
            <span className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full">
              {activeProject.nombre}
            </span>
            <TagDropDown
              etiquetas={etiquetas}
              selectedIds={selectedTagIds}
              onChange={handleTagChange}
              onCreateTag={refreshEtiquetas}
              loading={loadingTags}
            />
          </div>
        )}

        {user?.rol === "administrador" && (
          <NotificationSystem setActiveItem={setActiveItem} />
        )}

        <div className="flex items-center space-x-3">
          <div className="btn-primary text-white font-mono px-4 py-2 rounded-md">
            {formatTime(time)}
          </div>
          <button
            onClick={handleTimerButton}
            className="btn-primary rounded-full p-2.5 text-white"
          >
            {isTimerRunning ? <Pause /> : <Play />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
