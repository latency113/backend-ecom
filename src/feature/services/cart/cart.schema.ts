import z from "zod";
import { CartItemSchema } from "../cartItem/cartItem.schema"; // Import CartItemSchema

export const CartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  updatedAt: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  items: z.array(CartItemSchema).default([]), // Use 'items' to match Prisma's output
}).transform((data) => ({
  ...data,
  cartItems: data.items, // Map 'items' to 'cartItems'
  items: undefined, // Remove 'items' from the final output
}));

export const CreateCartSchema = z.object({
  userId: z.string().uuid(),
});

export const UpdateCartSchema = z.object({
  userId: z.string().uuid().optional(),
});

export type Cart = z.infer<typeof CartSchema>;
export type CreateCart = z.infer<typeof CreateCartSchema>;
export type UpdateCart = z.infer<typeof UpdateCartSchema>;