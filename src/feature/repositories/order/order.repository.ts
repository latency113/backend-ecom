import prisma from "@/providers/database/database.provider";
import { Prisma } from "@prisma/client"; // Import Prisma for types

export namespace OrderRepository {
  export const getAllOrders = async (
    page: number = 1,
    limit: number = 10,
    searchTerm: string = "",
    statusFilter: string = "all"
  ) => {
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (statusFilter !== "all") {
      where.status = statusFilter as any;
    }

    if (searchTerm) {
      where.OR = [
        { id: { contains: searchTerm } },
        { user: { fullName: { contains: searchTerm } } },
        { user: { email: { contains: searchTerm } } },
        { user: { username: { contains: searchTerm } } },
      ];
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, totalCount };
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