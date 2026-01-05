import z from "zod";

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(2).max(100),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
