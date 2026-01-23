import { OrderRepository } from "@/feature/repositories/order/order.repository";
import { ProductRepository } from "@/feature/repositories/product/product.repository"; // Import ProductRepository
import { OrderSchema, Order } from "./order.schema"; // Import Order type
import prisma from "@/providers/database/database.provider";
import { Prisma, OrderStatus } from "@/providers/database/generated/client";

export namespace OrderService {
  export const getAllOrders = async (
    page: number = 1,
    limit: number = 10,
    searchTerm: string = "",
    statusFilter: string = "all"
  ) => {
    const { orders, totalCount } = await OrderRepository.getAllOrders(
      page,
      limit,
      searchTerm,
      statusFilter
    );

    return {
      data: orders.map((order) => OrderSchema.parse(order)),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      itemsPerPage: limit,
    };
  };

  export const getOrderById = async (id: string) => {
    const order = await OrderRepository.getOrderById(id);
    if (!order) return null;
    // Repository now returns raw Prisma model, so parse it here
    return OrderSchema.parse(order);
  };

  export const createOrder = async (
    userId: string,
    orderItemsPayload: { productId: string; quantity: number; price: number }[],
    address: string,
    paymentMethod: string = "COD",
    paymentSlip: string | null = null
  ): Promise<Order> => {
    // Start a Prisma transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Check product stock and calculate total amount
      let totalAmount = 0;
      const productUpdates = [];

      for (const item of orderItemsPayload) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }
        totalAmount += item.quantity * item.price;

        // Prepare stock decrement operation
        productUpdates.push(
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        );
      }

      // 2. Create the order
      const isCard = paymentMethod === "CARD";
      const hasSlip = !!(paymentSlip && paymentSlip.trim().length > 0);
      
      const orderStatus = (isCard || (paymentMethod === "QR" && hasSlip)) 
        ? OrderStatus.PROCESSING 
        : OrderStatus.PENDING;
      
      console.log(`[OrderService] createOrder:`, {
        paymentMethod,
        hasSlip,
        status: orderStatus
      });

      const orderCreateInput: Prisma.OrderCreateInput = {
        user: { connect: { id: userId } },
        totalAmount: totalAmount,
        address: address,
        paymentMethod: paymentMethod,
        paymentSlip: paymentSlip,
        status: orderStatus,
        items: {
          createMany: {
            data: orderItemsPayload.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      };

      const order = await tx.order.create({
        data: orderCreateInput,
        include: { items: { include: { product: true } }, user: true },
      });

      console.log(`[OrderService] Order Created in DB:`, {
        id: order.id,
        status: order.status
      });

      // 3. Decrement product stocks
      await Promise.all(productUpdates);

      return order;
    });

    return OrderSchema.parse(newOrder);
  };

  // Keep update and delete orders as they are for now, or adapt them to new schema if needed
  // Note: updateOrder might need adjustment to handle nested item updates if that becomes a requirement
  export const updateOrder = async (
    id: string,
    data: Prisma.OrderUpdateInput
  ) => {
    const updatedOrder = await OrderRepository.updateOrder(id, data);
    return OrderSchema.parse(updatedOrder);
  };

  export const deleteOrder = async (id: string) => {
    const deletedOrder = await OrderRepository.deleteOrder(id);
    return OrderSchema.parse(deletedOrder);
  };

  export const getOrdersByUserId = async (userId: string) => {
    const orders = await OrderRepository.findManyByUserId(userId);
    return orders.map((order) => OrderSchema.parse(order));
  };

  export const cancelOrder = async (
    orderId: string,
    userId: string
  ): Promise<Order> => {
    const order = await OrderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.userId !== userId) {
      throw new Error("Unauthorized: You can only cancel your own orders.");
    }

    // Only allow cancellation for PENDING or PROCESSING orders

    if (order.status !== "PENDING" && order.status !== "PROCESSING") {
      throw new Error(
        `Order cannot be cancelled. Current status: ${order.status}. Only PENDING or PROCESSING orders can be cancelled.`
      );
    }

    // Start a transaction for cancellation and stock restoration

    const cancelledOrder = await prisma.$transaction(async (tx) => {
      // Restore stock for cancelled items

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },

          data: { stock: { increment: item.quantity } },
        });
      }

      // Update order status to CANCELLED

      const updatedOrder = await tx.order.update({
        where: { id: orderId },

        data: { status: "CANCELLED" },

        include: { items: { include: { product: true } }, user: true }, // Include items, product data, and user
      });

      return updatedOrder;
    });

    return OrderSchema.parse(cancelledOrder);
  };

  export const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ): Promise<Order> => {
    // Validate if the newStatus is a valid Order status using the Zod schema's parse method

    OrderSchema.shape.status.parse(newStatus); // This will throw if newStatus is invalid

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },

      data: { status: newStatus },

      include: {
        items: {
          include: {
            product: true,
          },
        },

        user: true,
      },
    });

    return OrderSchema.parse(updatedOrder);
  };
}
