import { Request, Response } from "express";
import { ProductService } from "@/feature/services/product/product.service";
import { CreateProductSchema, UpdateProductSchema } from "@/feature/services/product/product.schema"; // Import schemas

export namespace ProductController {
    export const getAllProductsHandler = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const searchTerm = req.query.searchTerm as string || "";
            const categoryId = req.query.categoryId as string || undefined;

            const { data, totalCount, currentPage, totalPages } = await ProductService.getAllProducts({ page, limit, searchTerm, categoryId });
            
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
            console.log("ProductController.createProductHandler: req.files", req.files);
            
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            const mainImage = files?.['image']?.[0];
            const galleryImages = files?.['images'] || [];

            const parsedBody = {
              name: req.body.name,
              description: req.body.description,
              price: parseFloat(req.body.price), // Convert price to float
              originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined, // Convert originalPrice to float
              promotionStart: req.body.promotionStart || undefined,
              promotionEnd: req.body.promotionEnd || undefined,
              stock: parseInt(req.body.stock),   // Convert stock to integer
              categoryId: req.body.categoryId
            }
            const parsedData = CreateProductSchema.parse(parsedBody); // Validate with Zod
            
            const imageFile = mainImage ? { originalname: mainImage.originalname, buffer: mainImage.buffer } : undefined;
            const galleryFiles = galleryImages.map(file => ({ originalname: file.originalname, buffer: file.buffer }));

            const newProduct = await ProductService.createProduct(parsedData, imageFile, galleryFiles);
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
            console.log("ProductController.updateProductHandler: req.files", req.files);

            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            const mainImage = files?.['image']?.[0];
            const galleryImages = files?.['images'] || [];

            const rawBody = req.body;
            const dataToUpdate: any = {};
            if (rawBody.name) dataToUpdate.name = rawBody.name;
            if (rawBody.description) dataToUpdate.description = rawBody.description;
            if (rawBody.price) dataToUpdate.price = parseFloat(rawBody.price); // Convert price to float
            if (rawBody.originalPrice !== undefined) dataToUpdate.originalPrice = rawBody.originalPrice ? parseFloat(rawBody.originalPrice) : null; // Convert originalPrice to float or null
            if (rawBody.promotionStart !== undefined) dataToUpdate.promotionStart = rawBody.promotionStart || null;
            if (rawBody.promotionEnd !== undefined) dataToUpdate.promotionEnd = rawBody.promotionEnd || null;
            if (rawBody.stock) dataToUpdate.stock = parseInt(rawBody.stock);   // Convert stock to integer
            if (rawBody.categoryId) dataToUpdate.categoryId = rawBody.categoryId;

            const parsedData = UpdateProductSchema.parse(dataToUpdate); // Validate with Zod

            const imageFile = mainImage ? { originalname: mainImage.originalname, buffer: mainImage.buffer } : undefined;
            const galleryFiles = galleryImages.map(file => ({ originalname: file.originalname, buffer: file.buffer }));

            const updatedProduct = await ProductService.updateProduct(productId, parsedData, imageFile, galleryFiles);
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