"use client"

export default function ConfirmationModal({ onConfirm, onCancel, selectedTime }) {
  const formatTime = (hour) => {
    return `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? " AM" : " PM"}`
  }

  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "long" }
    return date.toLocaleDateString("es-ES", options)
  }

  return (
    <div className="confirmation-modal" onClick={onCancel}>
      <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirmation-modal-title">¿Crear un nuevo evento?</h3>
        <p>
          Estás a punto de crear un evento para el <strong>{formatDate(selectedTime.day)}</strong> a las{" "}
          <strong>{formatTime(selectedTime.hour)}</strong>.
        </p>
        <div className="confirmation-modal-actions">
          <button className="confirmation-modal-button confirmation-modal-button-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirmation-modal-button confirmation-modal-button-confirm" onClick={onConfirm}>
            Crear evento
          </button>
        </div>
      </div>
    </div>
  )
}
