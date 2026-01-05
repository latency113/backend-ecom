import { CartItemRepository } from "@/feature/repositories/cartItem/cartItem.repository";
import { CartRepository } from "@/feature/repositories/cart/cart.repository"; // Import CartRepository
import { CartItemSchema, CreateCartItem, UpdateCartItem } from "./cartItem.schema"; // Keep UpdateCartItem for update operation
import { ProductRepository } from "@/feature/repositories/product/product.repository"; // Import ProductRepository

export namespace CartItemService {
  export const getAllCartItems = async () => {
    const cartItems = await CartItemRepository.getAllCartItems();
    return cartItems.map((cartItem) => CartItemSchema.parse(cartItem));
  };

  export const getCartItemById = async (id: string) => {
    const cartItem = await CartItemRepository.getCartItemById(id);
    if (!cartItem) return null;
    return CartItemSchema.parse(cartItem);
  };

  export const createCartItem = async (cartId: string, productId: string, quantity: number) => {
    // Check if cart item already exists for this product in this cart
    const existingCartItem = await CartItemRepository.findUniqueByCartIdAndProductId(
      cartId,
      productId
    );

    // Get product details to check stock
    const product = await ProductRepository.getProductById(productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    if (existingCartItem) {
      // If item exists, update its quantity
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new Error(`Cannot add ${quantity} more. Only ${product.stock - existingCartItem.quantity} items remaining in stock.`);
      }
      const updatedCartItem = await CartItemRepository.updateQuantity(existingCartItem.id, newQuantity);
      return CartItemSchema.parse(updatedCartItem);
    } else {
      // If item does not exist, create a new one
      if (quantity > product.stock) {
        throw new Error(`Cannot add ${quantity} items. Only ${product.stock} items remaining in stock.`);
      }
      const newCartItem = await CartItemRepository.createCartItem({ cartId, productId, quantity });
      return CartItemSchema.parse(newCartItem);
    }
  };

  export const updateCartItem = async (id: string, newQuantity: number) => {
    // Get cart item to check product stock
    const existingCartItem = await CartItemRepository.getCartItemById(id);
    if (!existingCartItem) {
      throw new Error("Cart item not found.");
    }
    const product = await ProductRepository.getProductById(existingCartItem.productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    if (newQuantity > product.stock) {
      throw new Error(`Cannot update quantity to ${newQuantity}. Only ${product.stock} items remaining in stock.`);
    }

    const updatedCartItem = await CartItemRepository.updateQuantity(id, newQuantity); // Use new method
    return CartItemSchema.parse(updatedCartItem);
  };

  export const deleteCartItem = async (id: string, userId: string) => {
    // First, verify that the cart item belongs to the user's cart
    const cartItem = await CartItemRepository.getCartItemById(id);
    if (!cartItem) {
      throw new Error("Cart item not found.");
    }

    // Fetch the cart associated with this cart item using CartRepository
    const cart = await CartRepository.getCartById(cartItem.cartId);

    if (!cart || cart.userId !== userId) {
      throw new Error("Unauthorized to delete this cart item.");
    }

    const deletedItem = await CartItemRepository.deleteCartItem(id);
    if (deletedItem === null) {
        throw new Error("Cart item not found."); // Item was not found in the repository
    }
    return; // Deletion successful, no data returned
  };
}