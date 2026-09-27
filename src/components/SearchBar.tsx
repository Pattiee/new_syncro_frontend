import React, { useState } from 'react';

// Define the incoming props contract for the search utility component
export interface SearchBarProps {
  onSearch: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  // Enforced explicit type boundaries for native HTML input mutations
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex justify-center w-full px-2 py-4 bg-transparent">
      <input
        value={query}
        onChange={handleSearch}
        type="search"
        placeholder="Search products..."
        className="w-[30vw] px-6 py-2 border border-gray-400 dark:border-gray-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-full font-light text-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
};

export default SearchBar;