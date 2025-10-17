import { ChevronRight } from 'lucide-react';

export const WorkspaceCard = ({ icon, title, description, status, onClick }) => (
  <div 
    className="border border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="font-medium text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">{status}</span>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  </div>
);