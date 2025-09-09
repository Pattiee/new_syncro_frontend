import { z } from "zod";


export const locationSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Location name cannot exceed 50 characters.'),
    code: z.string().min(1, 'Code is required').toUpperCase(),
    parentId: z.string().min(1, 'ParentId is required'),
    categoryId: z.string().min(1, 'CategoryId is required'),
  });