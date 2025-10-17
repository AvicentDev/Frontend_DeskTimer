export function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - (day === 0 ? 6 : day - 1)
  return new Date(d.setDate(diff))
}

export function generateWeekDays(currentWeekStart) {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart)
    date.setDate(date.getDate() + i)
    days.push(date)
  }
  return days
}

export function isToday(date) {
  if (!date) return false
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function formatMonthYear(date) {
  // date = currentWeekStart (comienzo de la semana)
  const endOfWeek = new Date(date)
  endOfWeek.setDate(endOfWeek.getDate() + 6)
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  if (date.getMonth() === endOfWeek.getMonth()) {
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  } else if (date.getFullYear() === endOfWeek.getFullYear()) {
    return `${months[date.getMonth()].substring(0, 3)} - ${
      months[endOfWeek.getMonth()]
    } ${endOfWeek.getFullYear()}`
  } else {
    return `${months[date.getMonth()]} ${date.getFullYear()} - ${
      months[endOfWeek.getMonth()]
    } ${endOfWeek.getFullYear()}`
  }
}
