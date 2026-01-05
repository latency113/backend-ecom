import { Request, Response } from "express";
import { CartService } from "@/feature/services/cart/cart.service";
import { CreateCartSchema, UpdateCartSchema } from "@/feature/services/cart/cart.schema";

export namespace CartController {
    export const getAllCartsHandler = async (req: Request, res: Response) => {
        try {
            const carts = await CartService.getAllCarts();
            res.status(200).json({ message: "Carts retrieved successfully", data: carts });
        } catch (error: any) {
            console.error("Error retrieving carts:", error);
            res.status(500).json({ 
                message: "Error retrieving carts", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const getCartByIdHandler = async (req: Request, res: Response) => {
        try {
            const cartId = req.params.id;
            const cart = await CartService.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            res.status(200).json({ message: "Cart retrieved successfully", data: cart });
        } catch (error: any) {
            console.error("Error retrieving cart:", error);
            res.status(500).json({ 
                message: "Error retrieving cart", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const createCartHandler = async (req: Request, res: Response) => {
        try {
            const parsedData = CreateCartSchema.parse(req.body);
            const newCart = await CartService.createCart(parsedData);
            res.status(201).json({ message: "Cart created successfully", data: newCart });
        } catch (error: any) {
            console.error("Error creating cart:", error);
            res.status(400).json({ 
                message: "Error creating cart", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const updateCartHandler = async (req: Request, res: Response) => {
        try {
            const cartId = req.params.id;
            const parsedData = UpdateCartSchema.parse(req.body);
            const updatedCart = await CartService.updateCart(cartId, parsedData);
            res.status(200).json({ message: "Cart updated successfully", data: updatedCart });
        } catch (error: any) {
            console.error("Error updating cart:", error);
            res.status(400).json({ 
                message: "Error updating cart", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const deleteCartHandler = async (req: Request, res: Response) => {
        try {
            const cartId = req.params.id;
            const deletedCart = await CartService.deleteCart(cartId);
            res.status(200).json({ message: "Cart deleted successfully", data: deletedCart });
        } catch (error: any) {
            console.error("Error deleting cart:", error);
            res.status(400).json({ 
                message: "Error deleting cart", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const getCartByUserIdHandler = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.userId; // Changed to userId
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const cart = await CartService.getCartByUserId(userId);
            if (!cart) {
                return res.status(200).json({ message: "Cart not found for this user", data: null }); // Respond with 200 OK and null data
            }
            res.status(200).json({ message: "Cart retrieved successfully", data: cart });
        } catch (error: any) {
            console.error("Error retrieving cart by user ID:", error);
            res.status(500).json({
                message: "Error retrieving cart by user ID",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };

    export const clearCartHandler = async (req: AuthRequest, res: Response) => {
        try {
            const cartId = req.params.id; // Expecting cartId in params
            const userId = req.user?.userId; // Authenticated user ID

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Verify cart belongs to user before clearing
            const cart = await CartService.getCartById(cartId); // Using getCartById from service
            if (!cart || cart.userId !== userId) {
                return res.status(403).json({ message: "Forbidden: Cart does not belong to user" });
            }

            const cleared = await CartService.clearUserCart(userId); // Service takes userId, it internally finds the cart
            if (cleared) {
                res.status(200).json({ message: "Cart items cleared successfully" });
            } else {
                res.status(404).json({ message: "Cart not found for user" });
            }
        } catch (error: any) {
            console.error("Error clearing cart items:", error);
            res.status(500).json({
                message: "Error clearing cart items",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };
}