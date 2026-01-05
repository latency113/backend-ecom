import { Request, Response } from "express";
import { ProductService } from "@/feature/services/product/product.service";
import { CreateProductSchema, UpdateProductSchema } from "@/feature/services/product/product.schema"; // Import schemas

export namespace ProductController {
    export const getAllProductsHandler = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const { data, totalCount, currentPage, totalPages } = await ProductService.getAllProducts({ page, limit });
            
            res.status(200).json({
                message: "Products retrieved successfully",
                data,
                totalCount,
                currentPage,
                totalPages,
                itemsPerPage: limit,
            });
        } catch (error: any) {
            console.error("Error retrieving products:", error);
            res.status(500).json({
                message: "Error retrieving products",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
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
        } catch (error: any) {
            console.error("Error retrieving product:", error);
            res.status(500).json({
                message: "Error retrieving product",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    }
    export const createProductHandler = async (req: Request, res: Response) => {
        try {
            console.log("ProductController.createProductHandler: req.body", req.body);
            console.log("ProductController.createProductHandler: req.file", req.file);
            console.log("ProductController.createProductHandler: Content-Type", req.headers['content-type']);
            // Data from req.body after multer processing (text fields are strings)
            const parsedBody = {
              name: req.body.name,
              description: req.body.description,
              price: parseFloat(req.body.price), // Convert price to float
              stock: parseInt(req.body.stock),   // Convert stock to integer
              categoryId: req.body.categoryId
            }
            const parsedData = CreateProductSchema.parse(parsedBody); // Validate with Zod
            const imageFile = req.file ? { originalname: req.file.originalname, buffer: req.file.buffer } : undefined;
            const newProduct = await ProductService.createProduct(parsedData, imageFile); // Pass imageFile
            res.status(201).json({ message: "Product created successfully", data: newProduct });
        } catch (error: any) {
            console.error("Error creating product:", error);
            res.status(400).json({
                message: "Error creating product",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    }
    export const updateProductHandler = async (req: Request, res: Response) => {
        try {
            const productId = req.params.id;
            console.log("ProductController.updateProductHandler: req.body", req.body);
            console.log("ProductController.updateProductHandler: req.file", req.file);
            console.log("ProductController.updateProductHandler: Content-Type", req.headers['content-type']);
            // Data from req.body after multer processing (text fields are strings)
            const rawBody = req.body;
            const dataToUpdate: any = {};
            if (rawBody.name) dataToUpdate.name = rawBody.name;
            if (rawBody.description) dataToUpdate.description = rawBody.description;
            if (rawBody.price) dataToUpdate.price = parseFloat(rawBody.price); // Convert price to float
            if (rawBody.stock) dataToUpdate.stock = parseInt(rawBody.stock);   // Convert stock to integer
            if (rawBody.categoryId) dataToUpdate.categoryId = rawBody.categoryId;

            const parsedData = UpdateProductSchema.parse(dataToUpdate); // Validate with Zod

            const imageFile = req.file ? { originalname: req.file.originalname, buffer: req.file.buffer } : undefined;
            const updatedProduct = await ProductService.updateProduct(productId, parsedData, imageFile); // Pass imageFile
            res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
        } catch (error: any) {
            console.error("Error updating product:", error);
            res.status(400).json({ message: "Error updating product",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    }
    export const deleteProductHandler = async (req: Request, res: Response) => {
        try {
            const productId = req.params.id;
            const deletedProduct = await ProductService.deleteProduct(productId);
            res.status(200).json({ message: "Product deleted successfully", data: deletedProduct });
        } catch (error: any) {
            console.error("Error deleting product:", error);
            res.status(400).json({ message: "Error deleting product",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    }

    export const getProductsByCategoryIdHandler = async (req: Request, res: Response) => {
        try {
            const categoryId = req.params.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const { data, totalCount, currentPage, totalPages } = await ProductService.getProductsByCategoryId(categoryId, { page, limit });
            
            res.status(200).json({
                message: "Products by category retrieved successfully",
                data,
                totalCount,
                currentPage,
                totalPages,
                itemsPerPage: limit,
            });
        } catch (error: any) {
            console.error("Error retrieving products by category:", error);
            res.status(500).json({
                message: "Error retrieving products by category",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    }
}