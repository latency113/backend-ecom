import z from "zod";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().min(5).nullable().optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  imgUrl: z.string().url().nullable().optional(),
  categoryId: z.string().uuid(),
  createdAt: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  updatedAt: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
});

export const CreateProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5).optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().uuid(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  price: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  categoryId: z.string().uuid().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;