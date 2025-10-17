"use client"
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { getWeekStart, generateWeekDays, isToday, formatMonthYear } from "./lib/utils"
import CalendarHeader from "./components/CalendarHeader"
import DayHeaders from "./components/DayHeaders"
import TimeGrid from "./components/TimeGrid"
import AddEventModal from "./components/AddEventModal"
import ConfirmationModal from "./components/ConfirmationModal"
import TimeRequestModal from "./components/TimeRequestModal"
import EditEventModal from "./components/EditEventModal"
import ListView from "./ListView"
import { fetchCalendarEvents } from "../../data/EventosData"
import { config } from "../../utils/config"
import { useTimer } from "../../components/auth/TimerContext"
import axios from "axios"
import "./Calendario.css"
import { Toast } from "./utils/Toast"

// --- Helpers para fechas en hora local ---
function parseLocal(dateTimeStr) {
  if (!dateTimeStr) return null
  const normalized = dateTimeStr.replace("T", " ").split(".")[0].replace("Z", "")
  const [date, time] = normalized.split(" ")
  const [year, month, day] = date.split("-").map(Number)
  const [hour = 0, minute = 0, second = 0] = (time || "").split(":").map(Number)
  return new Date(year, month - 1, day, hour, minute, second)
}

function fmtLocal(date) {
  const pad = (n) => n.toString().padStart(2, "0")
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  )
}

// Mapea eventos del backend a la forma que usa el estado
function mapEventToState(ev) {
  const inicio = parseLocal(ev.tiempo_inicio)
  const fin = ev.tiempo_fin ? parseLocal(ev.tiempo_fin) : null
  const pad = (n) => n.toString().padStart(2, "0")
  const timeFmt = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

  return {
    id: ev.id,
    proyecto_id: ev.proyecto?.id ?? null,
    tarea_id: ev.tarea?.id ?? null,
    title: ev.proyecto?.nombre ?? "Evento sin título",
    color: ev.proyecto?.color ?? "#ec4899",
    project: ev.proyecto?.nombre ?? "",
    client: ev.proyecto?.cliente?.nombre ?? "",
    startTime: inicio ? timeFmt(inicio) : "",
    endTime: fin ? timeFmt(fin) : null,
    description: ev.descripcion ?? "",
    location: ev.ubicacion ?? ev.proyecto?.descripcion ?? "",
    attendees: ev.usuario ? [ev.usuario.name] : [],
    organizer: ev.usuario?.name ?? "",
    date: inicio,
  }
}

export default function Calendario() {
  const [activeView, setActiveView] = useState("calendar")
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()))
  const [weekDays, setWeekDays] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [projects, setProjects] = useState([])
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const scrollContainerRef = useRef(null)
  const { time, activeEntry } = useTimer()
  const prevActiveRef = useRef(activeEntry)

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
  }

  // 1) Carga inicial de eventos
  useEffect(() => {
    fetchCalendarEvents()
      .then((data) => {
        setEvents(data.filter((ev) => ev.tiempo_inicio).map(mapEventToState))
      })
      .catch((err) => {
        console.error("Error cargando eventos:", err)
        showToast("Error al cargar eventos", "error")
      })
  }, [])

  // 2) Carga de proyectos
  useEffect(() => {
    const token = localStorage.getItem("token")
    axios
      .get(`${config.BASE_URL}/proyectos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProjects(res.data))
      .catch((err) => {
        console.error("Error cargando proyectos:", err)
        showToast("Error al cargar proyectos", "error")
      })
  }, [])

  // 3) Refrescar eventos al iniciar o detener timer
  useEffect(() => {
    const started = !prevActiveRef.current && activeEntry
    const stopped = prevActiveRef.current && !activeEntry

    if (started || stopped) {
      fetchCalendarEvents()
        .then((data) => {
          setEvents(data.filter((ev) => ev.tiempo_inicio).map(mapEventToState))
          if (stopped) {
            showToast("Evento finalizado y calendario actualizado", "success")
          }
        })
        .catch((err) => {
          console.error("Error recargando eventos tras cambio de timer:", err)
          showToast("Error al actualizar calendario", "error")
        })
    }
    prevActiveRef.current = activeEntry
  }, [activeEntry])

  // Semana, scroll y reloj
  useEffect(() => setWeekDays(generateWeekDays(currentWeekStart)), [currentWeekStart])

  useLayoutEffect(() => {
    setTimeout(() => {
      if (!scrollContainerRef.current) return
      const now = new Date(),
        cellH = 80,
        gap = 1
      const h = Math.min(22, Math.max(6, now.getHours()))
      scrollContainerRef.current.scrollTop =
        (h - 6 + now.getMinutes() / 60) * (cellH + gap) - 100
    }, 50)
  }, [weekDays])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Navegación de semanas
  const goToPreviousWeek = () =>
    setCurrentWeekStart((d) => {
      d.setDate(d.getDate() - 7)
      return new Date(d)
    })
  const goToNextWeek = () =>
    setCurrentWeekStart((d) => {
      d.setDate(d.getDate() + 7)
      return new Date(d)
    })
  const goToToday = () => setCurrentWeekStart(getWeekStart(new Date()))

  // Crear evento: flow de modales
  const handleTimeSlotClick = (day, hour) => {
    setSelectedTimeSlot({ day, hour })
    setShowConfirmationModal(true)
  }
  const handleConfirmCreateEvent = () => {
    setShowConfirmationModal(false)
    setShowAddEventModal(true)
  }
  const handleCancelCreateEvent = () => {
    setShowConfirmationModal(false)
    setSelectedTimeSlot(null)
  }

  // Añadir evento
  const handleAddEvent = async (formData) => {
    if (!selectedTimeSlot) {
      showToast("No hay casilla horaria seleccionada", "warning")
      return
    }
    const { day } = selectedTimeSlot
    const { title, project, startTime, endTime, tags } = formData
    const [h1, m1] = startTime.split(":").map(Number)
    const [h2, m2] = endTime.split(":").map(Number)
    const start = new Date(day); start.setHours(h1, m1, 0, 0)
    const end = new Date(day); end.setHours(h2, m2, 0, 0)
    const durationSecs = Math.floor((end - start) / 1000)

    const payload = {
      tiempo_inicio: fmtLocal(start),
      tiempo_fin: fmtLocal(end),
      proyecto_id: project,
      descripcion: title.trim(),
      duracion: durationSecs,
    }

    try {
      const token = localStorage.getItem("token")
      const createRes = await axios.post(
        `${config.BASE_URL}/entrada_tiempo`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const nuevaId = createRes.data.id || createRes.data.entrada_tiempo?.id
      if (tags?.length && nuevaId) {
        await axios.patch(
          `${config.BASE_URL}/entrada_tiempo/${nuevaId}/etiquetas`,
          { etiqueta_ids: tags },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      const fresh = await fetchCalendarEvents()
      setEvents(fresh.filter((ev) => ev.tiempo_inicio).map(mapEventToState))

      setShowAddEventModal(false)
      setSelectedTimeSlot(null)
      showToast("Evento creado correctamente", "success")
    } catch (err) {
      console.error("Error creando evento:", err.response?.data || err)
      showToast("No se pudo crear el evento", "error")
    }
  }

  // Editar evento
  const handleEventClick = (ev) => {
    if (activeEntry?.id === ev.id) {
      showToast("No se puede editar evento activo.", "warning")
      return
    }
    setSelectedEvent({ ...ev })
  }

  const handleSaveEdit = async () => {
    if (!selectedEvent) return
    if (activeEntry?.id === selectedEvent.id) {
      showToast("No se puede editar evento activo.", "warning")
      return
    }
    const makeDate = (d, t) => {
      const [h, m] = t.split(":").map(Number)
      const dt = new Date(d)
      dt.setHours(h, m, 0, 0)
      return dt
    }
    const payload = {
      tiempo_inicio: fmtLocal(makeDate(selectedEvent.date, selectedEvent.startTime)),
      tiempo_fin: fmtLocal(makeDate(selectedEvent.date, selectedEvent.endTime)),
      descripcion: selectedEvent.description,
      proyecto_id: selectedEvent.proyecto_id,
      tarea_id: selectedEvent.tarea_id ?? null,
      etiqueta_ids: Array.isArray(selectedEvent.etiquetas)
        ? selectedEvent.etiquetas.map((et) => (typeof et === "object" ? et.id : et))
        : [],
    }
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${config.BASE_URL}/entrada_tiempo/${selectedEvent.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEvents((evts) =>
        evts.map((e) =>
          e.id === selectedEvent.id ? { ...e, ...selectedEvent } : e
        )
      )
      setIsClosing(true)
      setTimeout(() => {
        setSelectedEvent(null)
        setIsClosing(false)
      }, 300)
      showToast("Evento actualizado correctamente", "success")
    } catch (err) {
      console.error(err.response?.data)
      showToast("Error al guardar el evento", "error")
    }
  }

  const handleDeleteEvent = async (id) => {
    if (activeEntry?.id === id) {
      showToast("No se puede eliminar evento activo.", "warning")
      return
    }
    if (!confirm("¿Seguro que quieres eliminar este evento?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${config.BASE_URL}/entrada_tiempo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEvents((evts) => evts.filter((e) => e.id !== id))
      setIsClosing(true)
      setTimeout(() => {
        setSelectedEvent(null)
        setIsClosing(false)
      }, 300)
      showToast("Evento eliminado correctamente", "success")
    } catch (err) {
      console.error(err.response?.data)
      showToast("No se pudo eliminar el evento", "error")
    }
  }

  const handleCancelEdit = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSelectedEvent(null)
      setIsClosing(false)
    }, 300)
  }

  const handleRequestTimeClick = () => setShowRequestModal(true)

  return (
    <div className="calendar-grid">
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <CalendarHeader
        formatMonthYear={formatMonthYear}
        currentWeekStart={currentWeekStart}
        goToPreviousWeek={goToPreviousWeek}
        goToToday={goToToday}
        goToNextWeek={goToNextWeek}
        activeView={activeView}
        setActiveView={setActiveView}
        onRequestTimeClick={handleRequestTimeClick}
      />

      {activeView === "calendar" ? (
        <>
          <DayHeaders weekDays={weekDays} isToday={isToday} />
          <TimeGrid
            scrollContainerRef={scrollContainerRef}
            weekDays={weekDays}
            events={events}
            isToday={isToday}
            currentTime={currentTime}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
            timerInSeconds={time}
            activeTimerId={activeEntry?.id}
          />

          {showConfirmationModal && (
            <ConfirmationModal
              selectedTime={selectedTimeSlot}
              onConfirm={handleConfirmCreateEvent}
              onCancel={handleCancelCreateEvent}
            />
          )}

          {showAddEventModal && (
            <AddEventModal
              setShowAddEventModal={setShowAddEventModal}
              addEvent={handleAddEvent}
              defaultStartTime={`${selectedTimeSlot.hour
                .toString()
                .padStart(2, "0")}:00`}
              defaultEndTime={`${((selectedTimeSlot.hour + 1) % 24)
                .toString()
                .padStart(2, "0")}:00`}
            />
          )}

          <EditEventModal
            event={selectedEvent}
            projects={projects}
            onChange={setSelectedEvent}
            onCancel={handleCancelEdit}
            onSave={handleSaveEdit}
            onDelete={handleDeleteEvent}
            isClosing={isClosing}
            isActive={activeEntry?.id === selectedEvent?.id}
          />

          {showRequestModal && (
            <TimeRequestModal
              isOpen={showRequestModal}
              onClose={() => setShowRequestModal(false)}
              entradaTiempoId={activeEntry?.id || null}
            />
          )}
        </>
      ) : (
        <ListView />
      )}
    </div>
  )
}
 