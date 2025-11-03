import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../schemas/product.schema';
import { addProduct, getCategories } from '../../services/products.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import MultipleFileInput from '../../components/Product/MultipleFileInput';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { images: [] },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories({});
        setCategories(res?.data ?? []);
      } catch (err) {
        console.error('Categories error:', err);
      }
    };
    loadCategories();
  }, [navigate]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify({
        name: data.name,
        category: data.category,
        percent_discount: data.percent_discount,
        price: data.price,
        condition: data.condition,
        specs: data.specs,
        featured: data.featured,
        stock: data.stock,
      })], { type: "application/json" })
    );

    data.images?.forEach(file => formData.append("images", file));

    try {
      setSubmitting(true);
      const res = await addProduct(formData);
      toast.success("Product added successfully!");
      methods.reset();
      navigate("/vendor/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:p-8 md:p-10 lg:p-12">
      <h2 className="mb-8 text-4xl font-semibold text-center text-orange-600 dark:text-orange-400">
        Add New Product
      </h2>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name & Category */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <input
                type="text"
                placeholder="Product Name"
                {...methods.register('name')}
                className="input-field"
              />
              {methods.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <select {...methods.register('category')} className="input-field">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {methods.formState.errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Discount & Images */}
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
              {methods.formState.errors.percent_discount && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.percent_discount.message}
                </p>
              )}
            </div>

            <div>
              <MultipleFileInput name="images" />
            </div>
          </div>

          {/* Price & Condition */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <input
                type="number"
                min={0}
                placeholder="Price"
                {...methods.register('price')}
                className="input-field"
              />
              {methods.formState.errors.price && (
                <p className="text-red-500 text-sm mt-1">{methods.formState.errors.price.message}</p>
              )}
            </div>

            <div>
              <select {...methods.register('condition')} className="input-field">
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Refurbished">Refurbished</option>
              </select>
              {methods.formState.errors.condition && (
                <p className="text-red-500 text-sm mt-1">{methods.formState.errors.condition.message}</p>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <textarea
              placeholder="Product specifications"
              {...methods.register('specs')}
              className="h-32 resize-none input-field"
            />
            {methods.formState.errors.specs && (
              <p className="text-red-500 text-sm mt-1">{methods.formState.errors.specs.message}</p>
            )}
          </div>

          {/* Featured & Stock */}
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
            {methods.formState.errors.stock && (
              <p className="text-red-500 text-sm mt-1">{methods.formState.errors.stock.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            disabled={submitting}
            type="submit"
            className="w-full py-4 text-xl font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            Add Product
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddProduct;
