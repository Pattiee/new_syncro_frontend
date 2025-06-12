export const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full gap-3 px-4 py-3 transition border rounded-lg 
        ${isActive ? 'bg-gray-100 dark:bg-gray-800 border-orange-400' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'}
      `}
    >
      <Icon className="w-5 h-5 text-orange-500" />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
  