import { OrderItemRepository } from "@/feature/repositories/orderItem/orderItem.repository";
import { OrderItemSchema, CreateOrderItem, UpdateOrderItem } from "./orderItem.schema";

export namespace OrderItemService {
  export const getAllOrderItems = async () => {
    const orderItems = await OrderItemRepository.getAllOrderItems();
    return orderItems.map((orderItem) => OrderItemSchema.parse(orderItem));
  };

  export const getOrderItemById = async (id: string) => {
    const orderItem = await OrderItemRepository.getOrderItemById(id);
    if (!orderItem) return null;
    return OrderItemSchema.parse(orderItem);
  };

  export const createOrderItem = async (data: CreateOrderItem) => {
    const newOrderItem = await OrderItemRepository.createOrderItem(data);
    return OrderItemSchema.parse(newOrderItem);
  };

  export const updateOrderItem = async (id: string, data: UpdateOrderItem) => {
    const updatedOrderItem = await OrderItemRepository.updateOrderItem(id, data);
    return OrderItemSchema.parse(updatedOrderItem);
  };

  export const deleteOrderItem = async (id: string) => {
    const deletedOrderItem = await OrderItemRepository.deleteOrderItem(id);
    return OrderItemSchema.parse(deletedOrderItem);
  };
}