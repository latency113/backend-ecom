import { Request, Response } from "express";
import { OrderService } from "@/feature/services/order/order.service";
import {
  CreateOrderSchema,
  UpdateOrderSchema,
} from "@/feature/services/order/order.schema";
import { AuthRequest } from "@/types/auth"; // Import AuthRequest
import z from "zod";
import { AddressService } from "@/feature/services/address/address.service";

export namespace OrderController {
  export const getAllOrdersHandler = async (req: Request, res: Response) => {
    try {
      const orders = await OrderService.getAllOrders();
      res
        .status(200)
        .json({ message: "Orders retrieved successfully", data: orders });
    } catch (error: any) {
      console.error("Error retrieving orders:", error);
      res.status(500).json({
        message: "Error retrieving orders",
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });
    }
  };

  export const getOrderByIdHandler = async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const order = await OrderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res
        .status(200)
        .json({ message: "Order retrieved successfully", data: order });
    } catch (error: any) {
      console.error("Error retrieving order:", error);
      res.status(500).json({
        message: "Error retrieving order",
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });
    }
  };

  export const createOrderHandler = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Define a schema for the incoming request body for order creation
      const IncomingOrderSchema = z.object({
        cartItems: z.array(
          z.object({
            productId: z.string().uuid(),
            quantity: z.number().int().min(1),
            price: z.number().nonnegative(),
          })
        ),
        addressId: z.string().uuid(), // Expect addressId instead of address string
      });

      const { cartItems, addressId } = IncomingOrderSchema.parse(req.body);

      // Fetch the full address details using the addressId
      const selectedAddress = await AddressService.getAddressById(addressId);

      if (!selectedAddress || selectedAddress.userId !== userId) {
        return res.status(404).json({ message: "Address not found or not authorized for this user." });
      }

      // Format the address string for storage in the Order model
      const formattedAddress = `${selectedAddress.street}, ${
        selectedAddress.city
      }, ${
        selectedAddress.stateProvince
          ? selectedAddress.stateProvince + ", "
          : ""
      }${selectedAddress.postalCode}, ${selectedAddress.country}`;

      // The service will calculate totalAmount
      const newOrder = await OrderService.createOrder(
        userId,
        cartItems,
        formattedAddress
      );
      res
        .status(201)
        .json({ message: "Order created successfully", data: newOrder });
    } catch (error: any) {
      console.log(error);
      if (error instanceof z.ZodError) {
        console.error("Zod Validation Error:", error);
        return res.status(400).json({
          message: "Validation Error for Incoming Order",
          errors: error,
        });
      }
      res.status(400).json({
        message: "Error creating order",
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });
    }
  };

  export const updateOrderHandler = async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const parsedData = UpdateOrderSchema.parse(req.body);
      const updatedOrder = await OrderService.updateOrder(orderId, parsedData);
      res
        .status(200)
        .json({ message: "Order updated successfully", data: updatedOrder });
    } catch (error: any) {
      console.error("Error updating order:", error);
      res.status(400).json({
        message: "Error updating order",
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });
    }
  };

  export const deleteOrderHandler = async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const deletedOrder = await OrderService.deleteOrder(orderId);
      res
        .status(200)
        .json({ message: "Order deleted successfully", data: deletedOrder });
    } catch (error: any) {
      console.error("Error deleting order:", error);
      res.status(400).json({
        message: "Error deleting order",
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });
    }
  };

  export const getOrdersByUserIdHandler = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const userId = req.params.id; // Get userId from URL params
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      // Optional: Add an authorization check here if req.user?.userId must match userId
      // For now, assuming middleware handles general auth and we fetch orders for the ID in params.
      // If the route expects the authenticated user's ID, it should be req.user?.userId directly.
      // Based on frontend usage: /orders/user/9e66e359-f6fa-4255-b7a0-c2c8c1a24312 - this means param.

      const orders = await OrderService.getOrdersByUserId(userId);
      res
        .status(200)
        .json({ message: "Orders retrieved successfully", data: orders });
    } catch (error: any) {
      console.error("Error retrieving orders by user ID:", error);
      res.status(500).json({
        message: "Error retrieving orders by user ID",
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });
    }
  };

  export const cancelOrderHandler = async (req: AuthRequest, res: Response) => {
    try {
      const orderId = req.params.id;

      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
      }

      const cancelledOrder = await OrderService.cancelOrder(orderId, userId);

      res.status(200).json({
        message: "Order cancelled successfully",
        data: cancelledOrder,
      });
    } catch (error: any) {
      console.error("Error cancelling order:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }

      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ message: error.message });
      }

      if (error.message.includes("cannot be cancelled")) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({
        message: "Error cancelling order",

        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });
    }
  };

  export const updateOrderStatusHandler = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const orderId = req.params.id;

      const { status } = req.body; // Expecting status from request body

      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
      }

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      // Cast status to Order['status'] to ensure type compatibility

      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        status as Order["status"]
      );

      res.status(200).json({
        message: "Order status updated successfully",
        data: updatedOrder,
      });
    } catch (error: any) {
      console.error("Error updating order status:", error);

      if (error.message.includes("Invalid status")) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({
        message: "Error updating order status",

        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });
    }
  };
}
