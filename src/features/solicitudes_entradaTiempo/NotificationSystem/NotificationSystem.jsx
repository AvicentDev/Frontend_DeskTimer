"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { config } from "../../../utils/config";
import { getSolicitudes } from "../../../data/SolicitudesData";
import NotificationItem from "./NotificationItem";

export default function NotificationSystem({ setActiveItem }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch and set notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const solicitudes = await getSolicitudes();
      setNotifications(
        solicitudes
          .filter(sol => sol.estado !== "rechazado" && sol.estado !== "aprobado")
          .map(sol => ({
            id: sol.id.toString(),
            title: "Nueva solicitud de tiempo",
            message: `${sol.usuario.name} ha enviado una solicitud. Comentario: ${sol.comentario || "Sin comentario"}.`,
            read: false,
            timestamp: new Date(sol.createdAt || Date.now()),
            type: "request",
          }))
      );
    } catch (err) {
      console.error("Error al cargar las notificaciones:", err);
      setError("No se pudieron cargar las notificaciones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch & polling every minute
  useEffect(() => {
    fetchNotifications();
    const polling = setInterval(fetchNotifications, 60000);
    return () => clearInterval(polling);
  }, [fetchNotifications]);

  // Click outside to close
  useEffect(() => {
    const onClickOutside = e => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Bell animation if there are unread
  useEffect(() => {
    let interval;
    if (unreadCount > 0) {
      setIsAnimating(true);
      interval = setInterval(() => setIsAnimating(a => !a), 3000);
    } else {
      setIsAnimating(false);
    }
    return () => interval && clearInterval(interval);
  }, [unreadCount]);

  // Approve request
  const handleAccept = async id => {
    try {
      await axios.put(
        `${config.BASE_URL}/solicitudes/${id}/aprobar`,
        {},
        { headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` } }
      );
      // Refetch to update list immediately
      await fetchNotifications();
    } catch (err) {
      console.error("No se pudo aprobar:", err.response?.status, err.response?.data);
    }
  };

  // Reject request
  const handleReject = async id => {
    try {
      await axios.put(
        `${config.BASE_URL}/solicitudes/${id}/rechazar`,
        {},
        { headers: { Authorization: `Bearer ${config.AUTH_TOKEN}` } }
      );
      // Refetch to update list immediately
      await fetchNotifications();
    } catch (err) {
      console.error("No se pudo rechazar:", err.response?.status, err.response?.data);
    }
  };

  // Format timestamp
  const formatDate = date => {
    if (!date) return "";
    const now = new Date();
    const d = new Date(date);
    return d.toDateString() === now.toDateString()
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString();
  };

  // View all handler
  const handleViewAll = () => {
    setIsOpen(false);
    setActiveItem("solicitudes");
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => {
          fetchNotifications();
          setIsOpen(o => !o);
        }}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
      >
        <Bell size={20} className={`text-yellow-500 ${isAnimating ? "animate-bell-ring" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center rounded-t-lg">
            <h3 className="text-sm font-semibold text-gray-700">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                {unreadCount} {unreadCount === 1 ? "nueva" : "nuevas"}
              </span>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">Cargando notificaciones...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell size={24} className="mx-auto text-gray-400" />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map(notif => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    formatDate={formatDate}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </ul>
            )}
          </div>
          <div className="p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleViewAll}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2 hover:bg-gray-100 rounded transition-colors"
            >
              Ver todas las solicitudes
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes bell-ring {
          0% { transform: rotate(0); }
          10% { transform: rotate(10deg); }
          20% { transform: rotate(-10deg); }
          30% { transform: rotate(6deg); }
          40% { transform: rotate(-6deg); }
          50% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
      `}</style>
    </div>
  );
}
