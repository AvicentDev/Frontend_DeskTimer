import React, { useContext } from 'react';
import { Edit, Archive, Trash2, X, Loader2, ArchiveRestore, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../../components/auth/AuthContext';
import { config } from '../../../utils/config';

export default function ActionBar({ 
  count, 
  onClear, 
  onDelete, 
  onEdit,  
  selectedProjects,
  proyectos,
  onArchive,
  isArchived,    // Prop para indicar vista archivada
  onRestore      // Handler para restaurar proyectos
}) {
  const { user } = useContext(AuthContext);

  // Handler para restaurar proyectos
  const handleRestore = async () => {
    if (!user) {
      console.error('No hay usuario logueado');
      return;
    }
    if (!window.confirm(`¿Estás seguro de que quieres restaurar ${selectedProjects.length} proyecto(s)?`)) {
      return;
    }
    try {
      for (const projectId of selectedProjects) {
        
        await axios.post(
          `${config.BASE_URL}/proyectos_archivados/${projectId}/restaurar`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.AUTH_TOKEN}`,
            },
          }
        );
      }
      if (typeof onRestore === 'function') {
        onRestore(selectedProjects);
      }
      if (typeof onClear === 'function') {
        onClear();
      }
    } catch (error) {
      console.error('Error al restaurar los proyectos:', error);
    }
  };

  // Handler para eliminar proyectos (se usa tanto en modo activo como en archivado)
  // Handler para eliminar proyectos (tanto en modo activo como en archivado)
const handleDelete = async () => {
  if (!user) {
    console.error('No hay usuario logueado');
    return;
  }
  const confirmationMessage = `¿Estás seguro de que quieres eliminar ${selectedProjects.length} proyecto(s)?`;
  if (!window.confirm(confirmationMessage)) {
    return;
  }
  
  try {
    for (const projectId of selectedProjects) {
      // Si estamos en la vista archivada, el endpoint podría cambiar a un recurso de proyectos archivados
      const url = isArchived 
        ? `${config.BASE_URL}/proyectos_archivados/${projectId}`
        : `${config.BASE_URL}/proyectos/${projectId}`;
      
      await axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.AUTH_TOKEN}`,
        },
      });
    }
    
    // Callback para actualización
    if (typeof onDelete === 'function') {
      onDelete(selectedProjects);
    }
    
    // Limpiar la selección
    if (typeof onClear === 'function') {
      onClear();
    }
  } catch (error) {
    console.error('Error al eliminar los proyectos:', error);
  }
};


  // Handlers para editar y archivar se mantienen en modo activo
  const handleEdit = () => {
    if (selectedProjects.length !== 1) {
      alert('Solo se puede editar un proyecto a la vez.');
      return;
    }
    const proyecto = proyectos.find(p => p.id === selectedProjects[0]);
    if (!proyecto) {
      return;
    }
    if (typeof onEdit === 'function') {
      onEdit(proyecto);
    }
  };

  const handleArchive = async () => {
  if (!user) {
    console.error('No hay usuario logueado');
    return;
  }
  if (!window.confirm(`¿Estás seguro de que quieres archivar ${selectedProjects.length} proyecto(s)?`)) {
    return;
  }
  try {
    for (const projectId of selectedProjects) {
      const response = await axios.post(
        `${config.BASE_URL}/proyectos/${projectId}/archivar`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.AUTH_TOKEN}`,
          },
        }
      );
      console.log('Proyecto archivado con éxito:', response.data);  // Log para ver la respuesta
    }

    if (typeof onArchive === 'function') {
      onArchive(selectedProjects);
    }
    if (typeof onClear === 'function') {
      onClear();
    }
  } catch (error) {
    console.error('Error al archivar los proyectos:', error);
    // Aquí podemos ver el error completo que llega del servidor
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
    } else {
      console.error('Error de red o fallo inesperado:', error.message);
    }
  }
};


  // Render para vista archivada: mostramos el botón de restaurar con Loader2 y el de eliminar
  if (isArchived) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-100 text-gray-700 shadow-md rounded-md dark:bg-[#242424] dark:text-white">
        <div className="text-sm font-medium">
          {count} item{count > 1 && 's'} selected
        </div>
        <div className="flex gap-2">
          <button 
            className="btn-primary px-2 py-1 transition-colors rounded" 
            title="Restaurar"
            onClick={handleRestore}
          >
            <RefreshCcw size={16}  className='text-white' />
          </button>
          <button 
            className="btn-primary px-2 py-1 transition-colors rounded" 
            title="Eliminar"
            onClick={handleDelete}
          >
            <Trash2 size={16} className="text-white" />
          </button>
          <button
            className="btn-primary px-2 py-1 transition-colors rounded"
            onClick={onClear}
            title="Limpiar selección"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  // Render para vista activa (normal)
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 text-gray-700 shadow-md rounded-md dark:bg-[#242424] dark:text-white">
      <div className="text-sm font-medium">
        {count} item{count > 1 && 's'} selected
      </div>
      <div className="flex gap-2">
        <button 
          className="btn-primary px-2 py-1 transition-colors rounded" 
          title="Editar"
          onClick={handleEdit}
        >
          <Edit size={16} className="text-white" />
        </button>
        <button 
          className="btn-primary px-2 py-1 transition-colors rounded" 
          title="Archivar"
          onClick={handleArchive}
        >
          <Archive size={16} className="text-white" />
        </button>
        <button
          className="btn-primary px-2 py-1 transition-colors rounded"
          onClick={handleDelete}
          title="Eliminar"
        >
          <Trash2 size={16} className="text-white" />
        </button>
        <button
          className="btn-primary px-2 py-1 transition-colors rounded"
          onClick={onClear}
          title="Limpiar selección"
        >
          <X size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
