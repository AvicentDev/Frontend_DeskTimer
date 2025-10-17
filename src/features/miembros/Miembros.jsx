import React, { useContext } from 'react';
import { AuthContext } from '../../components/auth/AuthContext';
import SkeletonLoader from '../../components/common/SkeletonLoader';

// Componente para renderizar el badge del rol
const RoleBadge = ({ role }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-800';

  switch (role) {
    case 'administrador':
      bgColor   = 'bg-blue-100';   // azul muy suave
      textColor = 'text-blue-800';
      break;
    case 'desarrollador':
      bgColor   = 'bg-blue-200';   // azul suave
      textColor = 'text-blue-800';
      break;
    case 'diseñador':
      bgColor   = 'bg-blue-300';   // azul medio
      textColor = 'text-blue-900';
      break;
    case 'tester':
      bgColor   = 'bg-blue-400';   // azul intenso
      textColor = 'text-blue-900';
      break;
    case 'otro':
      bgColor   = 'bg-blue-500';   // azul primario fuerte
      textColor = 'text-white';
      break;
    default:
      break;
  }


  return (
    <span className={`${bgColor} ${textColor} px-2 py-1 rounded-full text-xs font-semibold uppercase`}>
      {role}
    </span>
  );
};

const MiembrosDashboard = ({ miembros, loading, error, onSelectMiembro }) => {
  const { user } = useContext(AuthContext);

  if (loading) {
    return <SkeletonLoader rowCount={5} />;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error al obtener los miembros</div>;
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
                Rol
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {miembros.map((miembro) => (
              <tr
                key={miembro.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectMiembro(miembro)}
              >
                <td className="px-6 py-4 whitespace-nowrap">{miembro.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{miembro.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleBadge role={miembro.rol} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MiembrosDashboard;
