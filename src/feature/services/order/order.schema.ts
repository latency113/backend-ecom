import z from "zod";
import { OrderItemSchema } from "../orderItem/orderItem.schema";
import { UserSchema } from "../user/user.schema"; // Import UserSchema

export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  user: UserSchema, // Add user object
  totalAmount: z.number().nonnegative(),
  address: z.string().min(5).max(500),
  createdAt: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  updatedAt: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).default("PENDING"),
  paymentMethod: z.string().default("COD"),
  paymentSlip: z.string().nullable().optional(),
  items: z.array(OrderItemSchema),
});

export const CreateOrderSchema = z.object({
  userId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),
  address: z.string().min(5).max(500),
  paymentMethod: z.string().default("COD"),
  paymentSlip: z.string().nullable().optional(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).default("PENDING"),
});

export const UpdateOrderSchema = z.object({
  userId: z.string().uuid().optional(),
  totalAmount: z.number().nonnegative().optional(),
  address: z.string().min(5).max(500).optional(),
  paymentMethod: z.string().optional(),
  paymentSlip: z.string().nullable().optional(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;