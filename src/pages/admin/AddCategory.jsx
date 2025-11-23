import React, { useEffect, useState } from "react";
import { addCategory } from "../../api/products.api";
import { useSelector } from "react-redux";
import { set } from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ADMIN_LINKS_FRONTEND } from "../../links";

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME;

export const AddCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    setCreatedBy(user?.username ?? SHOP_NAME);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Data
    const categoryData = {
      name: name,
      createdBy: createdBy,
    };

    await addCategory(categoryData)
      .then((res) => {
        const responseName = res.data;
        setName("");
        toast.success(responseName);
        navigate(ADMIN_LINKS_FRONTEND.CATEGORIES);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-gray-100 shadow-md se dark:bg-gray-900 rounded-xl">
      <h2 className="mb-4 text-2xl font-bold text-orange-600 dark:text-orange-400">
        Add Category
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-200">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
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
          disabled={name.includes("`~")}
          className="w-full px-4 py-2 text-white transition duration-200 bg-orange-500 rounded-md hover:bg-orange-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
