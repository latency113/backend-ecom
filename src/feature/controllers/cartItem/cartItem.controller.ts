import { Request, Response } from "express";
import { CartItemService } from "@/feature/services/cartItem/cartItem.service";
import { CreateCartItemSchema, UpdateCartItemSchema } from "@/feature/services/cartItem/cartItem.schema";
import { AuthRequest } from "@/types/auth"; // Import AuthRequest
import z from "zod"; // Import z for ZodError

export namespace CartItemController {
    export const getAllCartItemsHandler = async (req: Request, res: Response) => {
        try {
            const cartItems = await CartItemService.getAllCartItems();
            res.status(200).json({ message: "Cart items retrieved successfully", data: cartItems });
        } catch (error: any) {
            console.error("Error retrieving cart items:", error);
            res.status(500).json({
                message: "Error retrieving cart items",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };

    export const getCartItemByIdHandler = async (req: Request, res: Response) => {
        try {
            const cartItemId = req.params.id;
            const cartItem = await CartItemService.getCartItemById(cartItemId);
            if (!cartItem) {
                return res.status(404).json({ message: "Cart item not found" });
            }
            res.status(200).json({ message: "Cart item retrieved successfully", data: cartItem });
        } catch (error: any) {
            console.error("Error retrieving cart item:", error);
            res.status(500).json({
                message: "Error retrieving cart item",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };

        export const createCartItemHandler = async (req: Request, res: Response) => {
            try {
                // Validate input using the schema
                const { cartId, productId, quantity } = CreateCartItemSchema.parse(req.body);

                // Call the service with individual parameters for upsert logic
                const newCartItem = await CartItemService.createCartItem(cartId, productId, quantity);
                res.status(201).json({ message: "Cart item created successfully", data: newCartItem });
            } catch (error: any) {
                console.error("Error creating cart item:", error);
                if (error instanceof z.ZodError) {
                    console.error("Zod Validation Error:", error.errors);
                    return res.status(400).json({
                        message: "Validation Error",
                        errors: error.errors
                    });
                }
                // Specific error handling for service-thrown errors
                if (error.message.includes("Product not found")) {
                  return res.status(404).json({ message: error.message });
                }
                if (error.message.includes("stock")) {
                  return res.status(400).json({ message: error.message });
                }
                res.status(400).json({
                    message: "Error creating cart item",
                    error: error instanceof Error ? { message: error.message, stack: error.stack } : error
                });
            }
        };
    export const updateCartItemHandler = async (req: Request, res: Response) => {
        try {
            const cartItemId = req.params.id;
            const { quantity } = UpdateCartItemSchema.parse(req.body); // Extract quantity
            const updatedCartItem = await CartItemService.updateCartItem(cartItemId, quantity);
            res.status(200).json({ message: "Cart item updated successfully", data: updatedCartItem });
        } catch (error: any) {
            console.error("Error updating cart item:", error);
            res.status(400).json({
                message: "Error updating cart item",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };

    export const deleteCartItemHandler = async (req: AuthRequest, res: Response) => {
        try {
            const cartItemId = req.params.id;
            const userId = req.user?.userId; // Get userId from auth middleware
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            // Pass userId to the service for authorization check
            await CartItemService.deleteCartItem(cartItemId, userId);
            res.status(200).json({ message: "Cart item deleted successfully" });
        } catch (error: any) {
            console.error("Error deleting cart item:", error);
            // Add specific handling for authorization error from service
            if (error.message === "Unauthorized to delete this cart item.") {
              return res.status(403).json({ message: error.message });
            }
            if (error.message === "Cart item not found.") {
              return res.status(404).json({ message: error.message });
            }
            res.status(400).json({
                message: "Error deleting cart item",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };
}