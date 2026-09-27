import React from 'react';

// Define an interface for incoming notification props to allow easy extension later
export interface NotificationCardProps {
  message?: string;
  buttonText?: string;
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  message = "Message",
  buttonText = "Some button",
  onActionClick
}) => {
  return (
    <div className='flex flex-col w-full max-w-md p-4 mx-auto mt-10 space-y-4 bg-white border border-gray-300 rounded-lg shadow-md sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4 dark:bg-gray-900 dark:border-gray-500'>
      <div className='flex items-start space-x-3'>
        <div className='flex items-center justify-center flex-shrink-0 w-10 h-10 text-orange-600 bg-orange-100 rounded-full dark:bg-orange-800 dark:text-white text-xs font-semibold px-1 text-center'>
          <p>{message}</p>
        </div>
      </div>

      <button 
        type='button'
        onClick={onActionClick}
        className='px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-500 transition-colors shadow-sm'
      >
        {buttonText}
      </button>
    </div>
  );
};

export default NotificationCard;