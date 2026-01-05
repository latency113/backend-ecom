import prisma from "@/providers/database/database.provider";

export namespace CartItemRepository {
  export const getAllCartItems = async () => {
    return prisma.cartItem.findMany({
      include: {
        product: true,
      },
    });
  };

  export const getCartItemById = async (id: string) => {
    return prisma.cartItem.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  };

  export const createCartItem = async (data: Prisma.CartItemCreateInput) => {
    return prisma.cartItem.create({
      data,
      include: {
        product: true, // Include product after creation
      },
    });
  };

  export const updateCartItem = async (id: string, data: Prisma.CartItemUpdateInput) => {
    return prisma.cartItem.update({
      where: { id },
      data,
      include: {
        product: true, // Include product after update
      },
    });
  };

  export const deleteCartItem = async (id: string) => {
    try {
      return await prisma.cartItem.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // P2025 means record to delete does not exist
        return null; // Gracefully handle not found
      }
      throw error; // Re-throw other errors
    }
  };

  export const findUniqueByCartIdAndProductId = async (cartId: string, productId: string) => {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: { // Unique constraint defined in Prisma schema for CartItem
          cartId,
          productId,
        },
      },
      include: {
        product: true,
      },
    });
  };

  export const updateQuantity = async (id: string, newQuantity: number) => {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity: newQuantity },
      include: {
        product: true,
      },
    });
  };
}