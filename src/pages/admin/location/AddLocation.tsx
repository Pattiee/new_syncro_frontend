import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { locationSchema, LocationFormData } from '../../../schemas/locationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

// Structural interface defining custom location categories
export interface LocationCategory {
  id: string | number;
  name: string;
}

export const AddLocation: React.FC = () => {
  const navigate = useNavigate();
  const [, setCountries] = useState<unknown[]>([]);
  const [, setCounties] = useState<unknown[]>([]);
  const [, setCities] = useState<unknown[]>([]);
  const [categories, setCategories] = useState<LocationCategory[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Bind the explicit inferred Zod validation schema interface definition to useForm
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors }, 
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  });

  useEffect(() => {
    const loadCategories = async (): Promise<void> => {
      try {
        // Placeholder for real asynchronous data fetches if needed
        // const res = await getLocationCategories({});
        // setCategories(res?.data || []);
        setCategories([
          { id: "1", name: "Country" },
          { id: "2", name: "County" },
          { id: "3", name: "City" }
        ]);
      } catch (err) {
        console.error("Failed to load layout categories:", err);
      }
    };

    loadCategories();
  }, []);

  const onSubmit: SubmitHandler<LocationFormData> = async (data) => {
    setSubmitting(true);
    try {
      console.log("Submitted location metadata: ", data);
      toast.success('Location added successfully!');
      reset();
    } catch (err) {
      const caughtError = err as Error;
      toast.error(caughtError?.message || 'Error adding location');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:p-8 md:p-10 lg:p-12">
      <h2 className="mb-8 text-4xl font-semibold text-center text-orange-600 dark:text-orange-400">
        Add New Location
      </h2>

      {/* Corrected submission interceptor routing */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <input
              type="text"
              placeholder="Location Name"
              {...register('name')}
              className="input-field"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            {/* Bound name to fields matching your schema model */}
            <select {...register('categoryId')} className="input-field">
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category?.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <input
              type="text"
              placeholder="Code e.g, KE, TZ,"
              {...register('code')}
              className="input-field"
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Parent ID reference"
              {...register('parentId')}
              className="input-field"
            />
            {errors.parentId && <p className="text-red-500 text-sm mt-1">{errors.parentId.message}</p>}
          </div>
        </div>

        <button
          disabled={submitting}
          type="submit"
          className="w-full py-4 text-xl font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Location"}
        </button>
      </form>
    </div>
  );
};