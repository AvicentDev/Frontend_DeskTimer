const getDurationInMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return 0

  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  const startTotalMinutes = startHour * 60 + startMinute
  let endTotalMinutes = endHour * 60 + endMinute

  // Si el endTime es menor al startTime, asumimos que pasó la medianoche
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60 // sumamos 24 horas (1440 minutos)
  }

  return endTotalMinutes - startTotalMinutes
}
