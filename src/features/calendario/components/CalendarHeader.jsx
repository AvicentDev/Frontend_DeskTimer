"use client"

import { useContext } from "react"
import { ChevronLeft, ChevronRight, Calendar, List, Square, Clock } from "lucide-react"
import { AuthContext } from "../../../components/auth/AuthContext"  // ajusta la ruta si es distinta

export default function CalendarHeader({
  formatMonthYear,
  currentWeekStart,
  goToPreviousWeek,
  goToToday,
  goToNextWeek,
  activeView,
  setActiveView,
  isTracking = false,
  onRequestTimeClick,
}) {
  const { user } = useContext(AuthContext)

  return (
    <div className="calendar-header">
      <div className="calendar-title">{formatMonthYear(currentWeekStart)}</div>

      <div className="flex items-center gap-4">
        {isTracking && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-md">
            <div className="animate-pulse">
              <Square size={14} />
            </div>
            <span className="text-sm font-medium">Registrando tiempo...</span>
          </div>
        )}

        <div className="calendar-controls flex items-center gap-2">
          <button onClick={goToPreviousWeek} className="calendar-button">
            <ChevronLeft size={16} />
          </button>
          <button onClick={goToToday} className="calendar-button calendar-button-today">
            Hoy
          </button>

          {/* Solo para empleados */}
          {user?.rol === "empleado" && (
            <button
              onClick={onRequestTimeClick}
              className="calendar-button calendar-button-request flex items-center"
            >
              <Clock size={16} className="mr-1" />
              <span>Solicitar</span>
            </button>
          )}

          <button onClick={goToNextWeek} className="calendar-button">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex border rounded-md overflow-hidden bg-gray-50">
          <button
            onClick={() => setActiveView("calendar")}
            className={`px-3 py-1.5 ${activeView === "calendar" ? "bg-blue-50 text-blue-600" : "bg-white"}`}
          >
            <Calendar size={16} />
          </button>
          <button
            onClick={() => setActiveView("list")}
            className={`px-3 py-1.5 ${activeView === "list" ? "bg-blue-50 text-blue-600" : "bg-white"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
