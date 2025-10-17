import { ChevronLeft, ChevronRight } from 'lucide-react';

export const SidebarToggle = ({ isOpen, toggleSidebar, sidebarWidth }) => {
  return (
    <button
      className={`sidebar-toggle ${isOpen ? 'sidebar-toggle-open' : 'sidebar-toggle-closed'}`}
      style={{
        left: isOpen ? sidebarWidth - 1 : 0,
      }}
      onClick={toggleSidebar}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? 
        <ChevronLeft size={14} strokeWidth={2.5} /> : 
        <ChevronRight size={14} strokeWidth={2.5} />
      }
    </button>
  );
};