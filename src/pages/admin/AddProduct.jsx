import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../schemas/product.schema';
import { addProduct, getCategories } from '../../services/products.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import MultipleFileInput from '../../components/Product/MultipleFileInput'

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      percent_discount: 0,
      stock: 1,
      images: [],
    }
  });

  // const { methods.register, handleSubmit, reset, formState: { methods.errors }, } = useForm({
  //   resolver: zodResolver(productSchema),
  //   defaultValues: {
  //     percent_discount: 0,
  //     stock: 1,
  //     images: [],
  //   }
  // });

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
      methods.reset();
      navigate('/');
    }).catch(err => {
      toast.error(err?.message || 'Error adding product');
    }).finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <FormProvider {...methods} className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:p-8 md:p-10 lg:p-12">
      <h2 className="mb-8 text-4xl font-semibold text-center text-orange-600 dark:text-orange-400">
        Add New Product
      </h2>

      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <input
              type="text"
              placeholder="Product Name"
              {...methods.register("name")}
              className="input-field"
            />
            {methods.formState.errors.name && <p className="text-red-500">{methods.formState.errors.name.message}</p>}
          </div>

          <div>
            <select {...methods.register('category')} className="input-field">
              <option value="">Select category</option>
              {categories.map((category, idx) => (
                <option className='flex px-4' key={category?.id} value={category?.name || 'Unknown'}>
                  <p className='bg-orange-500'>{idx + 1}. </p>
                  <p>{category?.name}</p>
                </option>
              ))}
            </select>
            {methods.formState.errors.category && <p className="text-red-500">{methods.formState.errors.category.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <input
              type="number"
              min={0}
              max={50}
              placeholder="Discount (%)"
              {...methods.register('percent_discount')}
              className="input-field"
            />
            {methods.formState.errors.percent_discount && <p className="text-red-500">{methods.formState.errors.percent_discount.message}</p>}
          </div>

          <div>
            <label htmlFor="images">Images</label>
            <MultipleFileInput name={"images"}/>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <input
              type="number"
              min={0}
              placeholder="Price"
              {...methods.register('price')}
              className="input-field"
            />
            {methods.formState.errors.price && <p className="text-red-500">{methods.formState.errors.price.message}</p>}
          </div>

          <div>
            <select {...methods.register('condition')} className="input-field">
              <option value="">Select condition</option>
              <option value="New">1. New</option>
              <option value="Refurbished">2. Refurbished</option>
            </select>
            {methods.formState.errors.condition && <p className="text-red-500">{methods.formState.errors.condition.message}</p>}
          </div>
        </div>

        <div>
          <textarea
            placeholder="Product description"
            {...methods.register('desc')}
            className="h-32 resize-none input-field"
          />
          {methods.formState.errors.desc && <p className="text-red-500">{methods.formState.errors.desc.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...methods.register('featured')} className="w-6 h-6 text-orange-600" />
          <label className="text-lg text-gray-700 dark:text-gray-200">Featured Product</label>
        </div>

        <div>
          <input
            type="number"
            min={1}
            placeholder="Stock"
            {...methods.register('stock')}
            className="input-field"
          />
          {methods.formState.errors.stock && <p className="text-red-500">{methods.formState.errors.stock.message}</p>}
        </div>

        <button
          disabled={submitting}
          type="submit"
          className="w-full py-4 text-xl font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Add Product
        </button>
      </form>
    </FormProvider>
  );
};

export default AddProduct;