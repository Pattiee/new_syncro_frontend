import React, { useState } from 'react';
import { createLocationCategory } from '../../../services/location.service';

// Structural type blueprint for location category payload creations
export interface CreateLocationCategoryPayload {
  name: string;
}

export const AddLocationCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleUpdateCategoryName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);

    const body: CreateLocationCategoryPayload = {
      name: categoryName,
    };

    try {
      const res = await createLocationCategory(body);
      console.log("Location category creation result: ", res);
      setCategoryName(''); // Clear form input state on success
    } catch (err) {
      console.error("Location category creation failed: ", err);
    } {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-md p-6 mx-auto bg-gray-100 shadow-md dark:bg-gray-900 rounded-xl">
        <h2 className="mb-4 text-2xl font-bold text-orange-600 dark:text-orange-400">
          Add Location Type
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200">Name</label>
            <input
              type="text"
              required
              value={categoryName}
              onChange={handleUpdateCategoryName}
              className="w-full p-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={categoryName.includes('`~') || submitting}
            className="w-full px-4 py-2 text-white transition duration-200 bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};