import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./components/Card";
import { getWeekStart, generateWeekDays } from "./lib/utils";
import { config } from "../../utils/config";

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtDay = (iso) =>
  new Date(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const fmtMonthYear = (date) =>
  new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(date);

// Devuelve duración en formato "Xh Ymin"
const fmtDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}min`;
};

export default function ListView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(new Date())
  );

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}/entrada_tiempo/listar`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${config.AUTH_TOKEN}`,
        },
      })
      .then((r) => {
        setGroups(r.data);
      })
      .catch(() => setError("Error cargando historial"))
      .finally(() => setLoading(false));
  }, []);

  const weekDays = useMemo(
    () => generateWeekDays(currentWeekStart),
    [currentWeekStart]
  );

  // Formateo local "YYYY-MM-DD" para coincidir con g.dia
  const weekDayStrings = weekDays.map((d) =>
    d.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  );

  const filtered = useMemo(
    () => groups.filter((g) => weekDayStrings.includes(g.dia)),
    [groups, weekDayStrings]
  );

  const prevWeek = () =>
    setCurrentWeekStart((d) => {
      const nn = new Date(d);
      nn.setDate(nn.getDate() - 7);
      return nn;
    });
  const nextWeek = () =>
    setCurrentWeekStart((d) => {
      const nn = new Date(d);
      nn.setDate(nn.getDate() + 7);
      return nn;
    });
  const goToToday = () => setCurrentWeekStart(getWeekStart(new Date()));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Controles de semana */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Historial de entradas
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevWeek}
            className="p-2 rounded hover:bg-gray-200 transition"
          >
            <ChevronLeft />
          </button>
          <span className="font-medium text-gray-600">
            {fmtMonthYear(currentWeekStart)}
          </span>
          <button
            onClick={goToToday}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Hoy
          </button>
          <button
            onClick={nextWeek}
            className="p-2 rounded hover:bg-gray-200 transition"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {loading ? (
        <div>Cargando historial...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-600 text-center">
          No hay entradas esta semana.
        </div>
      ) : (
        filtered.map(({ dia, entradas, total_tiempo }) => (
          <Card key={dia} className="mb-4">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">
                {fmtDay(dia)}
              </h3>
              {/* Total en horas y minutos */}
              <p className="text-sm text-gray-500">
                Total: <span className="font-semibold">{fmtDuration(total_tiempo)}</span>
              </p>
            </div>
            {/* Content */}
            <div className="px-4 py-3 space-y-2">
              {entradas.map((e) => (
                <div
                  key={e.id}
                  className="flex justify-between items-center text-sm bg-white p-2 rounded hover:bg-gray-50 transition"
                >
                  <span className="font-mono">
                    {fmtTime(e.tiempo_inicio)} – {fmtTime(e.tiempo_fin)}
                  </span>
                  <span className="text-gray-700">
                    {e.descripcion}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}