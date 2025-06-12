import React from 'react';

export const CategoryCard = ({ category }) => {
  const { id, name, available, createdBy } = category;

  return (
    <div
      key={id}
      className="flex items-center justify-between w-full px-4 py-3 m-2 bg-gray-200 rounded-xl dark:bg-gray-900 min-h-[4.5rem]"
      >
          {/* Left: Category name & creator */}
          <div className="flex flex-col gap-1">
              <div className='flex items-center gap-2'>
                  <span className="text-base font-semibold text-orange-600 dark:text-orange-400">
                      {name}
                  </span>
                  {/* Right: Status dot */}
                  <span
                      className={`h-3 w-3 rounded-full ${available ? 'bg-green-600' : 'bg-red-600'}`}
                      aria-label={available ? 'Available' : 'Unavailable'}
                      title={available ? 'Available' : 'Unavailable'}
                  />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                  {createdBy}
              </span>
          </div>
      </div>
    );
};
