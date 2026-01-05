import z from "zod";

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(500).optional(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  createdAt: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
});

export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(500).optional(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
});

export const UpdateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(1).max(500).optional(),
  userId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
});

export type Review = z.infer<typeof ReviewSchema>;
export type CreateReview = z.infer<typeof CreateReviewSchema>;
export type UpdateReview = z.infer<typeof UpdateReviewSchema>;