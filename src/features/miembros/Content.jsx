import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import AgregarMiembro from './AgregarMiembro';
import EditarMiembro from './EditarMiembro';
import MiembrosDashboard from './Miembros';
import { getMiembros } from '../../data/MiembrosData'; // Asegúrate de implementar esta función

const ContentMiembros = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMiembro, setSelectedMiembro] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar miembros
  const fetchMiembros = async () => {
    try {
      setLoading(true);
      const data = await getMiembros();
      setMiembros(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMiembros();
  }, []);

  // Función para agregar un nuevo miembro
  const handleAgregarMiembro = (nuevoMiembro) => {
    setMiembros((prev) => [...prev, nuevoMiembro]);
  };

  // Actualiza un miembro existente en el estado
  const handleEditarMiembro = (miembroActualizado) => {
    setMiembros((prev) =>
      prev.map(miembro =>
        miembro.id === miembroActualizado.id ? miembroActualizado : miembro
      )
    );
  };

  // Elimina un miembro del estado
  const handleBorrarMiembro = (miembroId) => {
    setMiembros((prev) => prev.filter(miembro => miembro.id !== miembroId));
  };

  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Miembros</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5 text-white" />
            Agregar Miembro
          </button>
        </div>

        <MiembrosDashboard 
          miembros={miembros}
          loading={loading}
          error={error}
          onSelectMiembro={(miembro) => setSelectedMiembro(miembro)}
        />
      </div>

      {/* Modal para agregar miembro */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
      >
        <AgregarMiembro
          onAgregar={(nuevoMiembro) => {
            handleAgregarMiembro(nuevoMiembro);
            setIsAddModalOpen(false);
          }}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Modal para editar o borrar miembro */}
      <Modal 
        isOpen={!!selectedMiembro} 
        onClose={() => setSelectedMiembro(null)}
      >
        <EditarMiembro
          miembro={selectedMiembro}
          onEditar={(miembroActualizado) => {
            handleEditarMiembro(miembroActualizado);
            setSelectedMiembro(null);
          }}
          onBorrar={(miembroId) => {
            handleBorrarMiembro(miembroId);
            setSelectedMiembro(null);
          }}
          onClose={() => setSelectedMiembro(null)}
        />
      </Modal>
    </main>
  );
};

export default ContentMiembros;
