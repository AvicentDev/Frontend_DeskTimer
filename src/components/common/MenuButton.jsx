export const MenuButton = ({ item, isOpen, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full py-3 px-4 rounded-lg transition-all ${
        isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
      } ${!isOpen && 'justify-center'}`}
    >
      <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
        {item.icon}
      </span>
      {isOpen && (
        <>
          <span className="ml-4 font-medium">{item.label}</span>
          {isActive && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
          )}
        </>
      )}
    </button>
  );