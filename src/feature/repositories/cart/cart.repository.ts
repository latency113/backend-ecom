import prisma from "@/providers/database/database.provider";

export namespace CartRepository {
  export const getAllCarts = async () => {
    return prisma.cart.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  };

  export const getCartById = async (id: string) => {
    return prisma.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  };

  export const createCart = async (data: Prisma.CartCreateInput) => {
    return prisma.cart.create({
      data,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  };

  export const updateCart = async (id: string, data: Prisma.CartUpdateInput) => {
    return prisma.cart.update({
      where: { id },
      data,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  };

  export const deleteCart = async (id: string) => {
    return prisma.cart.delete({
      where: { id },
    });
  };

  export const getCartByUserId = async (userId: string) => {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  };

  export const clearCartItems = async (cartId: string) => {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  };
}