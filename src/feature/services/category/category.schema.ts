import z from "zod";

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
});

export type Category = z.infer<typeof CategorySchema>;
