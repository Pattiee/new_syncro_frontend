import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Product name cannot exceed 50 characters.'),
  category: z.string().min(1, 'Category is required'),
  percent_discount: z.coerce.number().min(0, 'Discount cannot be negative').max(90, 'Discount cannot exceed 90%'),
  image_url: z.string().url('Invalid image URL'),
  price: z.coerce.number().gt(0, 'Price must be greater than 0'),
  condition: z.enum(['New', 'Refurbished']),
  desc: z.string().min(1, 'Description is required').max(200, 'Description cannot exceed 200 characters'),
  featured: z.boolean().default(false),
  stock: z.coerce.number().int().gt(0, 'Stock must be greater than 0'),
});
