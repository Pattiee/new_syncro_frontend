import { z } from "zod";

export const branchSchema = z.object({
  country: z.string().min(1, 'Country is required').max(30, 'Country name cannot exceed 30 characters.'),
  county: z.string().min(1, 'County is required').max(30, 'County name cannot exceed 30 characters.'),
  city: z.string().min(1, 'City is required').max(30, 'City name cannot exceed 30 characters.'),
  street: z.string().min(1, 'Street is required').max(30, 'Street name cannot exceed 30 characters.'),
  zip: z.string().min(1, 'Zip is required').max(30, 'Zip name cannot exceed 30 characters.'),
});