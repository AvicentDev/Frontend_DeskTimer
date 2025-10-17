"use client";

import { CheckCircle, XCircle, Clock } from "lucide-react";

const TableRow = ({ solicitud, handleAction, formatDate, renderStatus }) => (
  <tr className="bg-white">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
          {solicitud.usuario.name.charAt(0).toUpperCase()}
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{solicitud.usuario.name}</div>
          <div className="text-sm text-gray-500">
            {solicitud.usuario.email || "usuario@ejemplo.com"}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="text-sm text-gray-900 max-w-xs truncate">
        {solicitud.comentario || "Solicitud de tiempo"}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 font-medium">
        {solicitud.tiempoSolicitado || 8} horas
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-500">{ formatDate(solicitud.tiempo_inicio) }
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      {renderStatus(solicitud.estado)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      {solicitud.estado?.toLowerCase() === "pendiente" ? (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => handleAction(solicitud.id, "approve")}
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Aprobar
          </button>
          <button
            onClick={() => handleAction(solicitud.id, "reject")}
            className="text-gray-600 hover:text-gray-900"
          >
            Rechazar
          </button>
        </div>
      ) : (
        <span className="text-gray-500">Procesada</span>
      )}
    </td>
  </tr>
);

export default TableRow;
