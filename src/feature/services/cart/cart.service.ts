import { CartRepository } from "@/feature/repositories/cart/cart.repository";
import { CartSchema, CreateCart, UpdateCart } from "./cart.schema";

export namespace CartService {
  export const getAllCarts = async () => {
    const carts = await CartRepository.getAllCarts();
    return carts.map((cart) => CartSchema.parse(cart));
  };

  export const getCartById = async (id: string) => {
    const cart = await CartRepository.getCartById(id);
    if (!cart) return null;
    return CartSchema.parse(cart);
  };

  export const createCart = async (data: CreateCart) => {
    const newCart = await CartRepository.createCart(data);
    return CartSchema.parse(newCart);
  };

  export const updateCart = async (id: string, data: UpdateCart) => {
    const updatedCart = await CartRepository.updateCart(id, data);
    return CartSchema.parse(updatedCart);
  };

  export const deleteCart = async (id: string) => {
    const deletedCart = await CartRepository.deleteCart(id);
    return CartSchema.parse(deletedCart);
  };

  export const getCartByUserId = async (userId: string) => {
    const cart = await CartRepository.getCartByUserId(userId);
    if (!cart) return null; // Repository can now return null
    return CartSchema.parse(cart);
  };

  export const clearUserCart = async (userId: string) => {
    const cart = await getCartByUserId(userId); // Use the service's getCartByUserId
    if (cart) {
      await CartRepository.clearCartItems(cart.id);
      return true; // Cart items cleared
    }
    return false; // No cart found for user
  };
}