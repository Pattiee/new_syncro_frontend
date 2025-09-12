import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../schemas/product.schema';
import { addProduct, getCategories } from '../../services/products.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const requests = [
          await getCategories({}),
        ];
        const result = await Promise.allSettled(requests);

        const [ctgs] = result;

        if (ctgs.status === 'fulfilled') {
          setCategories(ctgs.value.data ?? []);
        } else {
          console.error("Categories error: ", ctgs.reason);
          toast.error(ctgs.reason);
        }
      } catch (error) {
        throw new Error('Failed to load data.');
      }
    }

    loadData();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    await addProduct(data).then(res => {
      toast.success('Product added successfully!');
      reset();
      navigate('/');
    }).catch(err => {
      toast.error(err?.message || 'Error adding product');
    }).finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:p-8 md:p-10 lg:p-12">
      <h2 className="mb-8 text-4xl font-semibold text-center text-orange-600 dark:text-orange-400">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <input
              type="text"
              placeholder="Product Name"
              {...register('name')}
              className="input-field"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <select {...register('category')} className="input-field">
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category?.id} value={category.name}>
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
              type="number"
              placeholder="Discount (%)"
              {...register('percent_discount')}
              className="input-field"
            />
            {errors.percent_discount && <p className="text-red-500">{errors.percent_discount.message}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Image URL"
              {...register('image_url')}
              className="input-field"
            />
            {errors.image_url && <p className="text-red-500">{errors.image_url.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <input
              type="number"
              placeholder="Price"
              {...register('price')}
              className="input-field"
            />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <select {...register('condition')} className="input-field">
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Refurbished">Refurbished</option>
            </select>
            {errors.condition && <p className="text-red-500">{errors.condition.message}</p>}
          </div>
        </div>

        <div>
          <textarea
            placeholder="Product description"
            {...register('desc')}
            className="h-32 resize-none input-field"
          />
          {errors.desc && <p className="text-red-500">{errors.desc.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('featured')} className="w-6 h-6 text-orange-600" />
          <label className="text-lg text-gray-700 dark:text-gray-200">Featured Product</label>
        </div>

        <div>
          <input
            type="number"
            placeholder="Stock"
            {...register('stock')}
            className="input-field"
          />
          {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
        </div>

        <button
          disabled={submitting}
          type="submit"
          className="w-full py-4 text-xl font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;