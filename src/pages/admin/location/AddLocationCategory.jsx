import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { createLocationCategory } from '../../../services/location.service';

export const AddLocationCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateCategoryName = (e) => setCategoryName(e.target.value);

  const handleSubmit = async () => {
    setSubmitting(true);
    const body = {
      name: categoryName,
    }
    await createLocationCategory(body).then(res => {
      console.log(res);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setSubmitting(false);
    });
  }

  return (
    <>
      <div className="max-w-md p-6 mx-auto bg-gray-100 shadow-md se dark:bg-gray-900 rounded-xl">
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
        {/* <div>
          <label className="block text-gray-700 dark:text-gray-200">Created By</label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="w-full p-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div> */}
        <button
          type="submit"
          disabled={categoryName.includes('`~') || submitting}
          className="w-full px-4 py-2 text-white transition duration-200 bg-orange-500 rounded-md hover:bg-orange-600"
        >
          Submit
        </button>
      </form>
    </div>
    </>
  )
}
