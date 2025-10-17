import axios from "axios";
import { useState } from "react";
import { Card } from "./Card";
import { Clock, MapPin, Users, X, Trash2 } from "lucide-react";
import { ToastContainer, Toast } from "../lib/Toast";
import { config } from "../../../utils/config";

export default function EventDetailModal({ event, onClose, onEventDeleted }) {
  const [toasts, setToasts] = useState([]);

  const handleDeleteEvent = async (id) => {
    if (event.endTime === null) {
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), message: "No se puede eliminar el evento sin tiempo de finalización", type: "error" },
      ]);
      return;
    }
    
    const token = localStorage.getItem("token");
    try {
      const url = `${config.BASE_URL}/entrada_tiempo/${id}`;
    
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), message: "Evento eliminado con éxito", type: "success" },
      ]);
    
      if (onEventDeleted) onEventDeleted(id);
      onClose();
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), message: "Error al eliminar el evento", type: "error" },
      ]);
    }
  };
  
  
  

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
        <Card className="relative max-w-md w-full mx-4 rounded-lg shadow-2xl">
          <div className={`p-6 rounded-t-lg ${event.color} text-white`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">{event.title}</h3>
              <button
                onClick={onClose}
                className="calendar-modal-close text-white/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                {`${event.startTime} - ${event.endTime}`}
              </p>
              <p className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {event.location}
              </p>
              <p className="flex items-start">
                <Users className="mr-2 h-5 w-5 mt-1" />
                <span>
                  <strong>Asistentes:</strong>
                  <br />
                  {event.attendees?.join(", ") || "Sin asistentes"}
                </span>
              </p>
              <p>
                <strong>Organizador:</strong> {event.organizer}
              </p>
              <p>
                <strong>Descripción:</strong> {event.description}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-b-lg flex justify-between gap-4">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
              onClick={() => handleDeleteEvent(event.id)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
            <button
              className="calendar-modal-primary animate-fade-in"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </Card>
      </div>

      {/* Asegúrate de que el ToastContainer esté recibiendo correctamente los toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
