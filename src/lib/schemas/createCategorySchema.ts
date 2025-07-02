import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string({ required_error: 'Name is required' })
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
