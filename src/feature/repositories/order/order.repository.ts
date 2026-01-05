import prisma from "@/providers/database/database.provider";
import { Prisma } from "@prisma/client"; // Import Prisma for types

export namespace OrderRepository {
  export const getAllOrders = async () => {
    // Return raw Prisma models, service will handle parsing
    return prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true, // Include user data
      },
    });
  };

  export const getOrderById = async (id: string) => {
    // Return raw Prisma model, service will handle parsing
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true, // Include user data
      },
    });
  };

  export const createOrder = async (data: Prisma.OrderCreateInput) => {
    // Repository takes Prisma input type, service will handle Zod parsing
    return prisma.order.create({
      data,
      include: { // Include items and user in the response so service can parse them
        items: {
          include: {
            product: true,
          },
        },
        user: true, // Include user data
      },
    });
  };

  export const updateOrder = async (id: string, data: Prisma.OrderUpdateInput) => {
    // Repository takes Prisma input type, service will handle Zod parsing
    return prisma.order.update({
      where: { id },
      data,
      include: { // Include items and user in the response if needed for parsing
        items: {
          include: {
            product: true,
          },
        },
        user: true, // Include user data
      },
    });
  };

  export const deleteOrder = async (id: string) => {
    // Return raw Prisma model, service will handle parsing
    return prisma.order.delete({
      where: { id },
    });
  };

  export const findManyByUserId = async (userId: string) => {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true, // Include user data
      },
    });
  };
}