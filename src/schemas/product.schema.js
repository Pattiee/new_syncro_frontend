import { z } from 'zod';


const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const maxPercentageDiscount = 50.0;

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(50, 'Product name cannot exceed 50 characters.'),
  category: z.string().min(1, 'Please select category.'),
  percent_discount: z.coerce.number().min(0, 'Discount cannot be negative').max(maxPercentageDiscount, 'Discount cannot exceed 50%.'),
  price: z.coerce.number().gt(0, 'Price must be greater than 0.'),
  condition: z.enum(['New', 'Refurbished']),
  specs: z.string().max(50, 'Product specifications cannot exceed 300 characters.').optional(),
  featured: z.boolean().default(false),
  stock: z.coerce.number().int().gt(0, 'Stock can not be less than 1.'),
  images: z
    .array(z.instanceof(File))
    .nonempty("Choose at least one image.")
    .refine((files) => files.length <= 3, "A maximum of 3 images allowed.")
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
      message: "Each file must be less than 5MB.",
    })
    .refine((files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
    "Only .jpeg, .jpg, .png, and .webp supported."),
});
