import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { addProduct } from '../../services/products.service';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    category: '',
    percent_discount: 0,
    image_url: '',
    price: 0,
    condition: 'New',
    desc: '',
    featured: false,
    stock: 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if ((type === 'number' && value < 0)) return;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value, }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.percent_discount < 0 || form.stock <= 0 || form.price <= 0) {
      toast.error("Invalid number values.");
      return;
    }
    try {
      await addProduct(form).then((res) => {
        toast.success('✅ Product added successfully!');
        console.log("Add product: " + res.data);
        setForm({
          name: '',
          category: '',
          percent_discount: 0,
          image_url: '',
          price: 0,
          condition: 'New',
          desc: '',
          featured: false,
          stock: 1,
        });
        navigate('/');
      });
    } catch (err) {
      toast.error(err?.message);
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 md:p-10 lg:p-12 max-w-4xl mx-auto rounded-lg shadow-xl">
      <h2 className="text-4xl font-semibold text-center text-orange-600 dark:text-orange-400 mb-8">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-4 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-4 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="number"
            name="percent_discount"
            value={form.percent_discount}
            onChange={handleChange}
            placeholder="Discount (%)"
            className="w-full p-4 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full p-4 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-4 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full p-4 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="New">New</option>
            <option value="Refurbished">Refurbished</option>
          </select>
        </div>

        <textarea
          name="desc"
          value={form.desc}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full p-4 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-32 resize-none"
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="h-6 w-6 text-orange-600"
          />
          <label className="text-gray-700 dark:text-gray-200 text-lg">
            Featured Product
          </label>
        </div>

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full p-4 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />

        <button
          type="submit"
          className="w-full py-4 bg-orange-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
