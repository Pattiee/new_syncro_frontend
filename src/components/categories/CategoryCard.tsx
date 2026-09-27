import React from 'react';

// Define the structural data contract for a single category entity
export interface CategoryRecordData {
  id: string | number;
  name: string;
  available?: boolean;
  createdBy?: string;
}

// Define the incoming props contract for the component wrapper
export interface CategoryCardProps {
  category: CategoryRecordData;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { name, available = true, createdBy = "System" } = category;

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-gray-200 rounded-xl dark:bg-gray-900 min-h-[4.5rem] border border-transparent dark:border-gray-800 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Left: Category name & creator */}
      <div className="flex flex-col gap-1">
        <div className='flex items-center gap-2'>
          <span className="text-base font-semibold text-orange-600 dark:text-orange-400">
            {name}
          </span>
          {/* Right: Status indicator dot */}
          <span
            className={`h-3 w-3 rounded-full shrink-0 ${available ? 'bg-green-600' : 'bg-red-600'}`}
            aria-label={available ? 'Available' : 'Unavailable'}
            title={available ? 'Available' : 'Unavailable'}
          />
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          By: {createdBy}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;