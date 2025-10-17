import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import AgregarCliente from './AgregarCliente';
import EditarCliente from './EditarCliente';
import { getClientes } from '../../data/ClientesData';
import ClientesDashboard from './Clientes';

const Content = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setError(error?.message || 'Ocurrió un error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Función para agregar cliente
  const handleAgregarCliente = (nuevoCliente) => {
    setClientes(prev => [...prev, nuevoCliente]);
  };

  // Actualiza el cliente en el estado
  const handleEditarCliente = (clienteActualizado) => {
    setClientes(prev =>
      prev.map(cliente =>
        cliente.id === clienteActualizado.id ? clienteActualizado : cliente
      )
    );
  };

  // Elimina el cliente del estado
  const handleBorrarCliente = (clienteId) => {
    setClientes(prev => prev.filter(cliente => cliente.id !== clienteId));
  };

  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5 text-white" />
            Agregar Cliente
          </button>
        </div>

        <ClientesDashboard
          clientes={clientes}
          loading={loading}
          error={error}
          onAgregarCliente={handleAgregarCliente}
          fetchClientes={fetchClientes}
          onSelectCliente={(cliente) => setSelectedCliente(cliente)}
        />
      </div>

      {/* Modal para agregar cliente */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
      >
        <AgregarCliente
          onAgregar={(nuevoCliente) => {
            handleAgregarCliente(nuevoCliente);
            setIsAddModalOpen(false);
          }}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Modal para editar/borrar cliente */}
      <Modal 
        isOpen={!!selectedCliente} 
        onClose={() => setSelectedCliente(null)}
      >
        <EditarCliente
          cliente={selectedCliente}
          onEditar={(clienteActualizado) => {
            handleEditarCliente(clienteActualizado);
            setSelectedCliente(null);
          }}
          onBorrar={(clienteId) => {
            handleBorrarCliente(clienteId);
            setSelectedCliente(null);
          }}
          onClose={() => setSelectedCliente(null)}
        />
      </Modal>
    </main>
  );
};

export default Content;
