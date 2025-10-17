// menuSections.js
import React from 'react';
import {
  Clock,
  BarChart,
  ClipboardList,
  User,
  Users,    
  Calendar,
  Tag,
} from 'lucide-react';

export const menuSections = [
  {
    sectionTitle: "Analyze",
    items: [
        { id: "calendario", label: "Calendario", icon: <Calendar size={18} /> },
      { id: "reports", label: "Reportes", icon: <BarChart size={18} /> },
      { id: "workspace", label: "WorkSpace", icon: <ClipboardList size={18} /> },

    ],
  },
  {
    sectionTitle: "Manage",
    items: [
    
      { id: "clientes", label: "Clientes", icon: <User size={18} /> },
      { id: "miembros", label: "Miembros", icon: <Users size={18} /> },
      { id: "etiquetas", label: "Etiquetas", icon: <Tag size={18} /> },
    ],
  },
];
