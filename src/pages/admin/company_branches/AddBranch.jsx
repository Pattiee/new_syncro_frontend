import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { branchSchema } from '../../../schemas/branchSchema'

export const AddBranch = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(branchSchema),
    });

    const onSubmit = async (data) => {
        if (!submitting) setSubmitting(true);
        try {
            console.log(data);
        //   const res = await createLocation(data);
            toast.success('Location added successfully!');
            reset();
        //   navigate('/');
        } catch (err) {
            toast.error(err?.message || 'Error adding location');
        } finally {
            setSubmitting(false);
        }
    };

    
    return (
        <>
            <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:p-8 md:p-10 lg:p-12">
                <h2 className="mb-8 text-4xl font-semibold text-center text-orange-600 dark:text-orange-400"> Create Branch </h2>

                <form onSubmit={() => handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <input
                            type="text"
                            placeholder="Country"
                            {...register('country')}
                            className="input-field"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>

                        <div>
                            <select {...register('category')} className="input-field">
                            <option value="">Select category</option>
                            {categories.map((category, idx) => (
                                <option key={category?.id} value={category.id}>
                                {category.name}
                                </option>
                            ))}
                            </select>
                            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
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
                            {errors.image_url && <p className="text-red-500">{errors.image_url.message}</p>}
                        </div>
                        </div>

                        <button
                        disabled={submitting}
                        type="submit"
                        className="w-full py-4 text-xl font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
                        >
                        Add Location
                        </button>
                    </form>
                </div>
        </>
    );
}
