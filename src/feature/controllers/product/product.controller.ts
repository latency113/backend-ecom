import { Request, Response } from "express";
import { ProductService } from "@/feature/services/product/product.service";

export namespace ProductController {
    export const getAllProductsHandler = async (req: Request, res: Response) => {
        try {
            const products = await ProductService.getAllProducts();
            res.status(200).json({ message: "Products retrieved successfully", data: products });
        } catch (error) {
            res.status(500).json({ message: "Error retrieving products", error });
        }
    }
    export const getProductByIdHandler = async (req: Request, res: Response) => {
        try {
            const productId = req.params.id;
            const product = await ProductService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({ message: "Product retrieved successfully", data: product });
        } catch (error) {
            res.status(500).json({ message: "Error retrieving product", error });
        }
    }
    export const createProductHandler = async (req: Request, res: Response) => {
        try {
            const { name, description, categoryId } = req.body;
            const price = parseFloat(req.body.price); // Convert price to float
            const stock = parseInt(req.body.stock);   // Convert stock to integer

            const imageFile = req.file ? { originalname: req.file.originalname, buffer: req.file.buffer } : undefined;
            const newProduct = await ProductService.createProduct({ name, description, price, stock, categoryId }, imageFile);
            res.status(201).json({ message: "Product created successfully", data: newProduct });
        } catch (error: any) {
            console.error("Error creating product:", error); // Log the full error for debugging
            res.status(400).json({ 
                message: "Error creating product", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    }
    export const updateProductHandler = async (req: Request, res: Response) => {
        try {
            const productId = req.params.id;
            const { name, description, price, stock, categoryId } = req.body;
            const updatedProduct = await ProductService.updateProduct(productId, { name, description, price, stock, categoryId });
            res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
        } catch (error) {
            res.status(400).json({ message: "Error updating product", error });
        }
    }
    export const deleteProductHandler = async (req: Request, res: Response) => {
        try {
            const productId = req.params.id;
            const deletedProduct = await ProductService.deleteProduct(productId);
            res.status(200).json({ message: "Product deleted successfully", data: deletedProduct });
        } catch (error) {
            res.status(400).json({ message: "Error deleting product", error });
        }
    }
}