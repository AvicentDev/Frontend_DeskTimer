export default function DayHeaders({ weekDays, isToday }) {
  const dayNames = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]

  return (
    <div className="day-headers">
      <div className="day-header"></div>
      {weekDays.map((day, index) => (
        <div key={index} className={`day-header ${isToday(day) ? "day-header-today" : ""}`}>
          <div>{dayNames[day.getDay()]}</div>
          <div className={`day-number ${isToday(day) ? "day-number-today" : ""}`}>{day.getDate()}</div>
        </div>
      ))}
    </div>
  )
}
