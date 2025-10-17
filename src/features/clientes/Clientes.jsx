import React, { useContext } from 'react';
import { AuthContext } from '../../components/auth/AuthContext';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const ClientesDashboard = ({ clientes, loading, error, fetchClientes, onAgregarCliente, onSelectCliente }) => {
  const { user } = useContext(AuthContext);

  if (loading) {
    return <SkeletonLoader rowCount={5} />;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error al obtener los clientes</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyectos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr
                key={cliente.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectCliente(cliente)}
              >
                <td className="px-6 py-4 whitespace-nowrap">{cliente.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.telefono}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {cliente.proyectos?.length > 0 ? (
                      cliente.proyectos.map((proyecto) => (
                        <span 
                          key={proyecto.id}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {proyecto.nombre}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Sin proyectos asignados</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientesDashboard;
