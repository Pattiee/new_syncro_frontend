// components/SearchBar.jsx
import React, { useState } from 'react';

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
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
        className="w-[30vw] px-6 py-2 border border-gray-400 dark:border-gray-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-full font-light text-xl"
      />
    </div>
  );
};
