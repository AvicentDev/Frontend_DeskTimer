import React from 'react'
import SkeletonLoader from '../../components/common/SkeletonLoader'

const EtiquetasDashboard = ({ etiquetas = [], loading, error, onSelectEtiqueta }) => {
  if (loading) {
    return <SkeletonLoader rowCount={5} />
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center text-red-600 bg-red-50 rounded">
        Error al obtener las etiquetas
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow max-w-6xl mx-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
            >
              Nombre
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {etiquetas.length > 0 ? (
            etiquetas.map((etiqueta, idx) => (
              <tr
                key={etiqueta.id}
                onClick={() => onSelectEtiqueta(etiqueta)}
                className={`
                  cursor-pointer transition-colors duration-150
                  ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  hover:bg-blue-50
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {etiqueta.nombre}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-4 text-center text-gray-500">
                No hay etiquetas disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default EtiquetasDashboard
