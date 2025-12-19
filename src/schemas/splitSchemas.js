// schemas/splitSchemas.js
import { z } from 'zod';

export const SplitFormSchema = z.object({
  title: z.string().min(1, 'Split title is required'),
  category: z.string().min(1, 'Category is required'),
  split_method: z.enum(['SpecificAmounts', 'EqualSplit', 'Percentage']).default('SpecificAmounts'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  location: z.string().min(1, 'Location is required'),
  amount: z.number().min(0).optional().default(0),
  max_participants: z.number().min(1).optional().default(1),
  image_url: z.string().nullable().optional(),
  visibility_radius: z.number().min(0).optional().default(0),
  rules: z.string().nullable().optional(),
});