import React, { useEffect, useState } from "react";
import { addCategory } from "../../api/products.api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ADMIN_LINKS_FRONTEND } from "../../links";

const SHOP_NAME: string = process.env.REACT_APP_SHOP_NAME || "Our Store";

// Define your Redux root state shape to protect global selectors
interface RootState {
  auth?: {
    user?: {
      username: string;
      [key: string]: unknown;
    } | null;
  };
}

// Structural type blueprint for category creation payloads
export interface CreateCategoryPayload {
  name: string;
  createdBy: string;
}

export const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<string>("");
  const [, setLoading] = useState<boolean>(false);
  
  // Strongly type the inline selector state mapping
  const user = useSelector((state: RootState) => state.auth?.user);

  useEffect(() => {
    setCreatedBy(user?.username ?? SHOP_NAME);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const categoryData: CreateCategoryPayload = {
      name: name,
      createdBy: createdBy,
    };

    try {
      setLoading(true);
      const res = await addCategory(categoryData);
      const responseName = (res?.data as string) || "Category added successfully";
      
      setName("");
      toast.success(responseName);
      navigate(ADMIN_LINKS_FRONTEND.CATEGORIES);
    } catch (err) {
      console.error("Failed to add category:", err);
      toast.error("An error occurred while creating the category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-gray-100 shadow-md dark:bg-gray-900 rounded-xl">
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value.trim())}
            className="w-full p-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={name.includes("`~")}
          className="w-full px-4 py-2 text-white transition duration-200 bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
};