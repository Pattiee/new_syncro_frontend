import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { branchSchema, BranchFormData } from '../../../schemas/branchSchema';

// Structural interface defining custom branch category drop-downs if utilized
export interface BranchCategoryOption {
  id: string | number;
  name: string;
}

export const AddBranch: React.FC = () => {
  const navigate = useNavigate();
  const [categories] = useState<BranchCategoryOption[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Bind the explicit inferred Zod validation schema interface definition to useForm
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
  });

  const onSubmit: SubmitHandler<BranchFormData> = async (data) => {
    setSubmitting(true);
    try {
      console.log("Submitted branch configuration data: ", data);
      toast.success('Branch created successfully!');
      reset();
    } catch (err) {
      const caughtError = err as Error;
      toast.error(caughtError?.message || 'Error adding branch');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:p-8 md:p-10 lg:p-12">
        <h2 className="mb-8 text-4xl font-semibold text-center text-orange-600 dark:text-orange-400"> 
          Create Branch 
        </h2>

        {/* Corrected submission layout interceptor */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <input
                type="text"
                placeholder="Country"
                {...register('country')}
                className="input-field"
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="County"
                {...register('county')}
                className="input-field"
              />
              {errors.county && <p className="text-red-500 text-sm mt-1">{errors.county.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <input
                type="text"
                placeholder="City"
                {...register('city')}
                className="input-field"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Street"
                {...register('street')}
                className="input-field"
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <input
                type="text"
                placeholder="Zip Code"
                {...register('zip')}
                className="input-field"
              />
              {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip.message}</p>}
            </div>
          </div>

          <button
            disabled={submitting}
            type="submit"
            className="w-full py-4 text-xl font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Branch"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddBranch;