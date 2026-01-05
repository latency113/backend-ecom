import z from "zod";
import { ProductSchema } from "../product/product.schema";

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  product: ProductSchema
});

export const CreateOrderItemSchema = z.object({
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
});

export const UpdateOrderItemSchema = z.object({
  orderId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  quantity: z.number().int().nonnegative().optional(),
  price: z.number().nonnegative().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type CreateOrderItem = z.infer<typeof CreateOrderItemSchema>;
export type UpdateOrderItem = z.infer<typeof UpdateOrderItemSchema>;