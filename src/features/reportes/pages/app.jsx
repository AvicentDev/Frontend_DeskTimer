"use client"

import React, { useState, useEffect, useMemo } from "react"
import { startOfWeek, addDays, addWeeks, format, differenceInCalendarDays, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronDown, Calendar, Clock, Filter, ArrowLeft, ArrowRight, Loader, X } from "lucide-react"
import BarChart from "../components/Bar-Chart"
import axios from "axios"
import { config } from "../../../utils/config"
import useProyectos from "../../../hooks/useProyectos"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

export default function TimeTrackingDashboard() {
  const COLORS = [
    "#60A5FA", // blue-400
    "#3B82F6", // blue-500
    "#2563EB"  // blue-600
  ]

  const { projects } = useProyectos()
  const today = new Date()
  const initialWeekStart = startOfWeek(today, { weekStartsOn: 1 })
  const initialSelectedDay = differenceInCalendarDays(today, initialWeekStart)

  const [weekStart, setWeekStart] = useState(initialWeekStart)
  const [selectedDay, setSelectedDay] = useState(
    initialSelectedDay >= 0 && initialSelectedDay < 7 ? initialSelectedDay : null,
  )
  const [showProjectFilter, setShowProjectFilter] = useState(false)
  const [showTimeFilter, setShowTimeFilter] = useState(false)
  const [selectedProject, setSelectedProject] = useState("Todos")
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Todos")
  const [showDayDetails, setShowDayDetails] = useState(false)

  // nuevo estado para datos, loading y error
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reportError, setReportError] = useState(null)

  const startDate = format(weekStart, "yyyy-MM-dd")
  const endDate   = format(addDays(weekStart, 6), "yyyy-MM-dd")

  // cada vez que cambien startDate o endDate, hago fetch y muestro loader
  useEffect(() => {
    setIsLoading(true)
    setReportError(null)

    axios
      .post(
        `${config.BASE_URL}/entrada_tiempo/reportes`,
        { start: startDate, end: endDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(res => setData(res.data))
      .catch(() => setReportError("Error cargando datos"))
      .finally(() => setIsLoading(false))
  }, [startDate, endDate])

  const dias     = data?.dias     || []
  const summary  = data?.proyectos || []
  const totalHours = data?.total  || 0

  const weekData = useMemo(() => {
    return dias.map(diaStr => {
      const dateObj = new Date(diaStr)
      const horasDia = summary.reduce((sum, proj) => sum + (proj.valores[diaStr] || 0), 0)
      return {
        day:      format(dateObj, "EEE", { locale: es }),
        date:     format(dateObj, "d/MM"),
        fullDate: diaStr,
        hours:    horasDia,
      }
    })
  }, [dias, summary])

  const formatTime = hours => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}:${m.toString().padStart(2, "0")}h`
  }

  const filteredProjects = useMemo(() => {
    return summary
      .filter(proj => selectedProject === "Todos" || proj.nombre === selectedProject)
      .map(proj => ({
        name:       proj.nombre,
        clientName: proj.cliente_nombre || "—",
        hours:      proj.total,
        percentage: proj.porcentaje,
      }))
  }, [summary, selectedProject])

  const selectedDayData = useMemo(() => {
    if (selectedDay === null || !weekData[selectedDay]) return null

    const selectedDate = weekData[selectedDay].fullDate
    const dayProjects = summary
      .map((proj, i) => ({
        name:       proj.nombre,
        clientName: proj.cliente_nombre || "—",
        hours:      proj.valores[selectedDate] || 0,
        color:      COLORS[i % COLORS.length],
      }))
      .filter(proj => proj.hours > 0)

    return {
      date:           selectedDate,
      formattedDate:  format(parseISO(selectedDate), "EEEE, d 'de' MMMM", { locale: es }),
      totalHours:     weekData[selectedDay].hours,
      projects:       dayProjects,
    }
  }, [selectedDay, weekData, summary])

  const handleDaySelect = dayIndex => {
    setSelectedDay(dayIndex)
    setShowDayDetails(true)
  }

  const changeWeek = dir => {
    const next = addWeeks(weekStart, dir === "next" ? 1 : -1)
    setWeekStart(next)
    setSelectedDay(null)
    setShowDayDetails(false)
  }

  const formattedTotal = formatTime(totalHours)
  const pieData = useMemo(() => filteredProjects.map(p => ({ name: p.name, value: p.hours })), [filteredProjects])

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-sm space-y-6">
      {/* Selector semana y total */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg">
          <button onClick={() => changeWeek("prev")} className="p-2 hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="week"
            className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={`${format(weekStart, "yyyy")}-W${format(weekStart, "II")}`}
            onChange={e => {
              const [y, w] = e.target.value.split("-W")
              const first = new Date(y, 0, 1)
              first.setDate(first.getDate() + (parseInt(w) - 1) * 7)
              setWeekStart(startOfWeek(first, { weekStartsOn: 1 }))
              setShowDayDetails(false)
            }}
          />
          <button onClick={() => changeWeek("next")} className="p-2 hover:bg-gray-200 rounded-full">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 mr-1" />
            {formattedTotal}
          </div>
          <Filter className="w-4 h-4 cursor-pointer" />
          <Calendar className="w-4 h-4 cursor-pointer" />
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="font-semibold mb-4">Horas Registradas</h2>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin w-8 h-8 text-gray-400" />
          </div>
        ) : reportError ? (
          <p className="text-red-500">{reportError}</p>
        ) : (
          <BarChart
            data={weekData}
            maxHours={Math.max(...weekData.map(d => d.hours), 8)}
            selectedDay={selectedDay}
            onSelectDay={handleDaySelect}
          />
        )}
      </div>

      {/* Detalles del día seleccionado */}
      {showDayDetails && selectedDayData && (
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-4 relative">
          <button
            onClick={() => setShowDayDetails(false)}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full bg-white z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <h3 className="text-lg font-semibold text-gray-800 capitalize">{selectedDayData.formattedDate}</h3>
          <div className="space-y-3 mt-4">
            <h4 className="text-sm font-medium text-gray-500">Proyectos del día</h4>
            {selectedDayData.projects.length === 0 ? (
              <p className="text-gray-500 italic">No hay registros para este día</p>
            ) : (
              <ul className="space-y-3">
                {selectedDayData.projects.map((proj, idx) => (
                  <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: proj.color }} />
                      <div>
                        <p className="font-medium text-gray-800">{proj.name}</p>
                        <p className="text-xs text-gray-500">{proj.clientName}</p>
                      </div>
                    </div>
                    <span className="font-mono text-gray-700">{formatTime(proj.hours)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6 relative">
        <div className="relative">
          <button
            onClick={() => {
              setShowProjectFilter(!showProjectFilter)
              setShowTimeFilter(false)
            }}
            className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2"
          >
            Proyecto: {selectedProject}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {showProjectFilter && (
            <div className="absolute top-full left-0 bg-gray-50 border border-gray-200 rounded-lg shadow-lg mt-1 z-10 w-48">
              <button
                onClick={() => {
                  setSelectedProject("Todos")
                  setShowProjectFilter(false)
                }}
                className={`w-full text-left px-3 py-1.5 text-sm ${
                  selectedProject === "Todos" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              {projects.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setSelectedProject(proj.nombre)
                    setShowProjectFilter(false)
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm ${
                    selectedProject === proj.nombre ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  {proj.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resumen de Proyectos + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Resumen de Proyectos</h3>
          <ul className="space-y-4">
            {filteredProjects.map((proj, idx) => (
              <li key={idx} className="grid grid-cols-[16px_1fr_120px_80px_1fr] items-center gap-4">
                <span
                  className="w-3 h-3 rounded-full justify-self-center"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-gray-800 font-medium">{proj.name}</span>
                <span className="text-sm text-gray-500 text-center">{proj.clientName}</span>
                <span className="text-sm font-mono text-gray-700 text-center">{formatTime(proj.hours)}</span>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${proj.percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-xl font-bold text-gray-900">{formattedTotal}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución Horas</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={val => formatTime(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
