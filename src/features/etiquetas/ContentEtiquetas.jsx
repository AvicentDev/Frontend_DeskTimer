import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import AgregarEtiqueta from './AgregarEtiqueta';
import EditarEtiqueta from './EditarEtiqueta';
import EtiquetasDashboard from './Etiquetas';
import useEtiquetas from '../../hooks/useEtiquetas';

const ContentEtiquetas = () => {
  const { etiquetas, loading, refreshEtiquetas } = useEtiquetas();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEtiqueta, setSelectedEtiqueta] = useState(null);
  const [error, setError] = useState(null);

  // Opcional: manejar error en refresh
  const fetchEtiquetas = async () => {
    try {
      setError(null);
      await refreshEtiquetas();
    } catch (err) {
      setError(err.message || 'Error al cargar etiquetas');
    }
  };

  useEffect(() => {
    fetchEtiquetas();
  }, []);

  // Después de crear/editar/borrar podemos volver a recargar
  const handleAfterChange = () => {
    fetchEtiquetas();
  };

  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Etiquetas</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5 text-white" />
            Agregar Etiqueta
          </button>
        </div>

  
        <EtiquetasDashboard
          etiquetas={etiquetas}
          loading={loading}
          error={error}
          onSelectEtiqueta={(etiqueta) => setSelectedEtiqueta(etiqueta)}
        />
      </div>

      {/* Modal para agregar etiqueta */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
      >
        <AgregarEtiqueta
          onSuccess={() => {
            handleAfterChange();
            setIsAddModalOpen(false);
          }}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Modal para editar/borrar etiqueta */}
      <Modal 
        isOpen={!!selectedEtiqueta} 
        onClose={() => setSelectedEtiqueta(null)}
      >
        <EditarEtiqueta
          etiqueta={selectedEtiqueta}
          onSuccess={() => {
            handleAfterChange();
            setSelectedEtiqueta(null);
          }}
          onClose={() => setSelectedEtiqueta(null)}
        />
      </Modal>
    </main>
  );
};

export default ContentEtiquetas;
