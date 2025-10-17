import { useState, useEffect } from "react";
const darkenHex = (hex, amount = 0.2) => {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));
  return `rgb(${r}, ${g}, ${b})`;
};
// Calcula la duración en minutos entre dos horas (formato HH:MM)
const getDurationInMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
};

// Formatea el tiempo transcurrido en HH:MM:SS
const formatElapsedTime = (milliseconds) => {
  if (milliseconds <= 0) return "00:00:00";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:
         ${minutes.toString().padStart(2, "0")}:
         ${seconds.toString().padStart(2, "00")}`;
};

// Calcula la altura en píxeles desde el inicio del evento hasta el "now"
const calculateLiveHeightToCurrentTime = (event, currentTime) => {
  const [startHour, startMinute] = event.startTime.split(":").map(Number);
  const start = new Date(event.date);
  start.setHours(startHour, startMinute, 0);
  const millisecondsSinceStart = currentTime - start;
  const minutesSinceStart = millisecondsSinceStart / 60000;
  return Math.max(1, (minutesSinceStart / 60) * 80);
};

// Calcula la altura fija de un evento (según su duración)
const calculateEventHeight = (startTime, endTime) => {
  const durationMinutes = getDurationInMinutes(startTime, endTime);
  return (durationMinutes / 60) * 80;
};

// Calcula la posición "top" de un evento dentro de su celda
const calculateEventTop = (startTime) => {
  if (!startTime) return 0;
  const [hour, minute] = startTime.split(":").map(Number);
  return (minute / 60) * 80;
};

// Convierte a formato YYYY-MM-DD
const formatDateISO = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
};

export default function TimeGrid({
  scrollContainerRef,
  weekDays = [],
  events = [],
  isToday = () => false,
  currentTime: externalCurrentTime,
  onTimeSlotClick = () => {},
  onEventClick = () => {},
  timerInSeconds,
  activeTimerId,
}) {
  const [currentTime, setCurrentTime] = useState(
    externalCurrentTime ? new Date(externalCurrentTime) : new Date()
  );
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    if (!externalCurrentTime) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
        setForceUpdate((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [externalCurrentTime]);

  useEffect(() => {
    if (externalCurrentTime) {
      setCurrentTime(new Date(externalCurrentTime));
    }
  }, [externalCurrentTime]);

// --- Rango fijo de 6 AM a 11 PM ---
const minHour = 6;
const maxHour = 23;  // 11 PM en formato 24h

const timeSlots = Array.from(
  { length: maxHour - minHour + 1 },
  (_, i) => {
    const hour = minHour + i;
    const labelHour = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return { hour, label: `${labelHour} ${ampm}` };
  }
);

  // -----------------------------------------------

  const getEventsForSlot = (day, hour) =>
    events
      .filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === day.getDate() &&
          eventDate.getMonth() === day.getMonth() &&
          eventDate.getFullYear() === day.getFullYear() &&
          parseInt(event.startTime.split(":")[0], 10) === hour
        );
      })
      .sort((a, b) =>
        parseInt(a.startTime.split(":")[1], 10) -
        parseInt(b.startTime.split(":")[1], 10)
      )
      .map((event, index, filtered) => ({
        ...event,
        width: filtered.length > 1 ? `${100 / filtered.length}%` : "100%",
        left: filtered.length > 1 ? `${(index * 100) / filtered.length}%` : "0%",
      }));

  return (
    <div className="overflow-auto flex-1 hide-scrollbar calendar-grid">
      <div className="min-w-full h-full">
        <div
          className="relative hide-scrollbar"
          ref={scrollContainerRef}
          style={{ height: "calc(100vh - 200px)", overflowY: "auto" }}
        >
          {timeSlots.map((slot, timeIndex) => (
            <div
              key={`${timeIndex}-${forceUpdate}`} 
              className="calendar-grid-container"
            >
              <div className="calendar-time-cell">{slot.label}</div>
              {weekDays.map((day, dayIndex) => {
                const now = currentTime;
                const isCurrentHour = isToday(day) && now.getHours() === slot.hour;
                const slotEvents = getEventsForSlot(day, slot.hour);

                return (
                  <div
                    key={`${dayIndex}-${forceUpdate}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTimeSlotClick(day, slot.hour);
                    }}
                    className={`calendar-day-cell relative ${isToday(day) ? "today" : ""}`}
                  >
                    {isCurrentHour && (
                      <div
                        className="absolute left-0 right-0 z-10"
                        style={{
                          top: `${(now.getMinutes() + now.getSeconds() / 60) * (80 / 60)}px`,
                          height: "2px",
                          background: "#ec4899",
                        }}
                      >
                        <div className="calendar-time-indicator" style={{ position: "relative" }}>
                          <div
                            className="calendar-time-indicator-dot"
                            style={{
                              background: "#ec4899",
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              position: "absolute",
                              top: "50%",
                              left: "-6px",
                              transform: "translateY(-50%)",
                              zIndex: 11,
                            }}
                          ></div>
                          <div className="calendar-time-indicator-line"></div>
                        </div>
                      </div>
                    )}

                    {slotEvents.map((event, eventIndex) => {
                      
                      const eventStart = new Date(
                        `${formatDateISO(event.date)}T${event.startTime}`
                      );
                      let eventEnd = event.endTime
                        ? new Date(`${formatDateISO(event.date)}T${event.endTime}`)
                        : null;
                      if (!eventEnd) eventEnd = currentTime;

                      const isEventActive = event.endTime
                        ? now >= eventStart && now < eventEnd
                        : now >= eventStart;

                      let elapsedTimeFormatted = "";
                      if (isEventActive) {
                        if (activeTimerId && event.id === activeTimerId && timerInSeconds != null) {
                          elapsedTimeFormatted = formatElapsedTime(timerInSeconds * 1000);
                        } else {
                          const elapsedTime = now - eventStart;
                          elapsedTimeFormatted = formatElapsedTime(elapsedTime);
                        }
                      }

                      const eventHeight = isEventActive
                        ? calculateLiveHeightToCurrentTime(event, currentTime)
                        : calculateEventHeight(event.startTime, event.endTime);

                      const showTimeCounter = eventHeight >= 20;

                      return (
                        <div
                          key={`${eventIndex}-${forceUpdate}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className="calendar-event"
                          style={{
                            top: `${calculateEventTop(event.startTime)}px`,
                            height: `${eventHeight}px`,
                            width: event.width,
                            left: event.left,
                            zIndex: 5,
                            overflow: "hidden",
                            background: event.color
                              ? `${event.color}33`
                              : isEventActive
                              ? "rgba(236, 72, 153, 0.2)"
                              : "#cbd5e1",
                            borderLeft: `3px solid ${
                              event.color
                                ? darkenHex(event.color, 0.2)
                                : isEventActive
                                ? "#ec4899"
                                : "#94a3b8"
                            }`,
                            minHeight: "1px",
                            transition: "height 0.1s linear",
                          }}
                        >
                          <div className="calendar-event-content" style={{ position: "relative" }}>
                            {isEventActive && showTimeCounter && (
                              <div className="text-pink-500 font-mono font-bold text-xs">
                                {elapsedTimeFormatted}
                              </div>
                            )}
                            <div className="calendar-event-title text-xs text-gray-800">{event.description}</div>
                            {eventHeight >= 30 &&
                              getDurationInMinutes(event.startTime, event.endTime || "00:00") >= 15 && (
                                <div className="calendar-event-time text-xs text-gray-500">
                                  {event.startTime} - {event.endTime || "Activo"}
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { getDurationInMinutes };
