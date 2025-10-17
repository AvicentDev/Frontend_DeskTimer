import React from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'dashboard', label: 'Detalles' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'team', label: 'Team' }
  ];

  return (
    <div className="flex gap-4 border-b border-gray-300 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`pb-2 ${
            activeTab === tab.key ? 'border-b-2 border-blue-600 text-blue-600' : ''
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
