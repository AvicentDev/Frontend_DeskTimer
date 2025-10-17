// NotificationItem.jsx
"use client";

export default function NotificationItem({ notification, onAccept, onReject, formatDate }) {
  return (
    <li className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""}`}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
          <span className="text-xs text-gray-500">{formatDate(notification.timestamp)}</span>
        </div>
        <p className="text-sm text-gray-600">{notification.message}</p>
        {notification.type === "request" && !notification.read && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onAccept(notification.id)}
              className="px-3 py-1 text-xs !bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex-1"
            >
              Aprobar
            </button>
            <button
              onClick={() => onReject(notification.id)}
              className="px-3 py-1 text-xs !bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex-1"
            >
              Rechazar
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
