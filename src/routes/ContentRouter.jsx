import React from 'react';
import Content from '../features/clientes/Content';
import ContentMiembros from '../features/miembros/Content';
import ContentProyectos from '../features/proyectos/components/Content';
import ContentTareas from '../features/tareas/pages/ContentTareas';
import { WorkspaceContent } from '../features/workspace';
import AdminSolicitudes from '../features/solicitudes_entradaTiempo/Admin-Solicitudes/AdminSolicitudes';
import Calendario from '../features/calendario/Calendario';
import ReportsPage from '../features/reportes/pages/app';
import ContentEtiquetas from '../features/etiquetas/ContentEtiquetas';

export const ContentRouter = ({
  activeItem,
  setActiveItem,
  projectsData,
  setProjectsData,
  refreshProject,
  selectedProyectoDetail,
  setSelectedProyectoDetail,
}) => {
  const contentMap = {
    calendario: < Calendario />,
    reports : <ReportsPage/>,
    clientes: <Content />,
    miembros: <ContentMiembros />,
    workspace: <WorkspaceContent setActiveItem={setActiveItem} />,
    proyectos: (
      <ContentProyectos
        projectsData={projectsData}
        setProjectsData={setProjectsData}
        refreshProject={refreshProject}
        selectedProyectoDetail={selectedProyectoDetail}
        setSelectedProyectoDetail={setSelectedProyectoDetail}
      />
    ),
    tareas: <ContentTareas />,
    solicitudes: <AdminSolicitudes />,
    etiquetas:<ContentEtiquetas />,
  };

  return contentMap[activeItem] || <div>Opción no encontrada</div>;
};
