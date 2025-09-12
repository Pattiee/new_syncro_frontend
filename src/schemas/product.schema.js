import { z } from 'zod';


const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const maxPercentageDiscount = 50.0;

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Product name cannot exceed 50 characters.'),
  category: z.string().min(1, 'Category is required'),
  percent_discount: z.coerce.number().min(0, 'Discount cannot be negative').max(maxPercentageDiscount, 'Discount cannot exceed 50%'),
  price: z.coerce.number().gt(0, 'Price must be greater than 0'),
  condition: z.enum(['New', 'Refurbished']),
  desc: z.string().min(1, 'Description is required').max(200, 'Description cannot exceed 200 characters'),
  featured: z.boolean().default(false),
  stock: z.coerce.number().int().gt(0, 'Stock must be greater than 0'),
  images: z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, "At least one image is required.")
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
      message: "Each file must be less than 5MB",
    })
    .refine((files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
  "Only .jpeg, .jpg, .png, and .webp supported")
});
