import React from "react";

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    onClick={onCancel}
  >
    <div
      className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold mb-4">{message}</h3>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 !bg-gray-300 rounded hover:bg-gray-400"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="px-4 py-2 !bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onConfirm}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
