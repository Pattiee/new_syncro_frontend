export const ContactsNavbar = () => {
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs sm:text-[10px]">
      <div className="w-full mx-auto px-4 py-2 flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <span className="font-medium text-orange-600">Welcome to Syncro</span>
          <span className="text-gray-700 dark:text-gray-200">
            +254727608698
          </span>
          <span className="text-gray-700 dark:text-gray-200">
            info@syncro.co.ke
          </span>
        </div>

        {/* Right side */}
        <div className="flex space-x-4">
          <a
            href="/staff"
            className="text-gray-700 dark:text-gray-200 hover:text-orange-600 transition"
          >
            Staff Portal
          </a>
          <a
            href="/contact"
            className="text-gray-700 dark:text-gray-200 hover:text-orange-600 transition"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
};
