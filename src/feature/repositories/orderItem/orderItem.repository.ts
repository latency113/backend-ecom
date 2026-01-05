import prisma from "@/providers/database/database.provider";
import { CreateOrderItem, UpdateOrderItem, OrderItemSchema } from "@/feature/services/orderItem/orderItem.schema";

export namespace OrderItemRepository {
  export const getAllOrderItems = async () => {
    const orderItems = await prisma.orderItem.findMany();
    return orderItems.map((orderItem) => OrderItemSchema.parse(orderItem));
  };

  export const getOrderItemById = async (id: string) => {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id },
    });
    return orderItem ? OrderItemSchema.parse(orderItem) : null;
  };

  export const createOrderItem = async (data: CreateOrderItem) => {
    const newOrderItem = await prisma.orderItem.create({
      data,
    });
    return OrderItemSchema.parse(newOrderItem);
  };

  export const updateOrderItem = async (id: string, data: UpdateOrderItem) => {
    const updatedOrderItem = await prisma.orderItem.update({
      where: { id },
      data,
    });
    return OrderItemSchema.parse(updatedOrderItem);
  };

  export const deleteOrderItem = async (id: string) => {
    const deletedOrderItem = await prisma.orderItem.delete({
      where: { id },
    });
    return OrderItemSchema.parse(deletedOrderItem);
  };
}