import React from 'react';

const DashboardTab = ({ project }) => (
  <div className="space-y-6">
    <div className="p-6 bg-white rounded-lg shadow border-l-4 border-blue-500">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Descripción</h3>
      <p className="text-gray-600">{project.descripcion}</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 bg-white rounded-lg shadow border-l-4 border-green-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Tiempo Estimado</h3>
        <p className="text-gray-600">{project.tiempo_estimado}h</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow border-l-4 border-purple-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Fecha de Entrega</h3>
        <p className="text-gray-600">
          {project.fecha_entrega || 'No definida'}
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 bg-white rounded-lg shadow border-l-4 border-red-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Estado</h3>
        <p className="text-gray-600">{project.estado}</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow border-l-4 border-yellow-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Prioridad</h3>
        <p className="text-gray-600">{project.prioridad}</p>
      </div>
    </div>
  </div>
);

export default DashboardTab;
