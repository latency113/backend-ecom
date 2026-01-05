import { Request, Response } from "express";
import { OrderItemService } from "@/feature/services/orderItem/orderItem.service";
import { CreateOrderItemSchema, UpdateOrderItemSchema } from "@/feature/services/orderItem/orderItem.schema";

export namespace OrderItemController {
    export const getAllOrderItemsHandler = async (req: Request, res: Response) => {
        try {
            const orderItems = await OrderItemService.getAllOrderItems();
            res.status(200).json({ message: "Order items retrieved successfully", data: orderItems });
        } catch (error: any) {
            console.error("Error retrieving order items:", error);
            res.status(500).json({ 
                message: "Error retrieving order items", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const getOrderItemByIdHandler = async (req: Request, res: Response) => {
        try {
            const orderItemId = req.params.id;
            const orderItem = await OrderItemService.getOrderItemById(orderItemId);
            if (!orderItem) {
                return res.status(404).json({ message: "Order item not found" });
            }
            res.status(200).json({ message: "Order item retrieved successfully", data: orderItem });
        } catch (error: any) {
            console.error("Error retrieving order item:", error);
            res.status(500).json({ 
                message: "Error retrieving order item", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const createOrderItemHandler = async (req: Request, res: Response) => {
        try {
            const parsedData = CreateOrderItemSchema.parse(req.body);
            const newOrderItem = await OrderItemService.createOrderItem(parsedData);
            res.status(201).json({ message: "Order item created successfully", data: newOrderItem });
        } catch (error: any) {
            console.error("Error creating order item:", error);
            res.status(400).json({ 
                message: "Error creating order item", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const updateOrderItemHandler = async (req: Request, res: Response) => {
        try {
            const orderItemId = req.params.id;
            const parsedData = UpdateOrderItemSchema.parse(req.body);
            const updatedOrderItem = await OrderItemService.updateOrderItem(orderItemId, parsedData);
            res.status(200).json({ message: "Order item updated successfully", data: updatedOrderItem });
        } catch (error: any) {
            console.error("Error updating order item:", error);
            res.status(400).json({ 
                message: "Error updating order item", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const deleteOrderItemHandler = async (req: Request, res: Response) => {
        try {
            const orderItemId = req.params.id;
            const deletedOrderItem = await OrderItemService.deleteOrderItem(orderItemId);
            res.status(200).json({ message: "Order item deleted successfully", data: deletedOrderItem });
        } catch (error: any) {
            console.error("Error deleting order item:", error);
            res.status(400).json({ 
                message: "Error deleting order item", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };
}