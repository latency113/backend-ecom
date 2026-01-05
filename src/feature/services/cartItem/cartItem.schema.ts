import z from "zod";
import { ProductSchema } from "../product/product.schema"; // Import ProductSchema

export const CartItemSchema = z.object({
  id: z.string().uuid(),
  cartId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().nonnegative().default(1),
  product: ProductSchema, // Add product details here
});

export const CreateCartItemSchema = z.object({
  cartId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().nonnegative().default(1),
});

export const UpdateCartItemSchema = z.object({
  cartId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  quantity: z.number().int().nonnegative().optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type CreateCartItem = z.infer<typeof CreateCartItemSchema>;
export type UpdateCartItem = z.infer<typeof UpdateCartItemSchema>;