import { Express ,Request,Response} from "express";
import { CategoryService } from "@/feature/services/category/category.service";
import { CreateCategorySchema, UpdateCategorySchema } from "@/feature/services/category/category.schema"; // Import schemas

export namespace CategoryController {
    export const getAllCategoriesHandler = async (req: Request, res: Response) => {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json({ message: "Categories retrieved successfully", data: categories });
        } catch (error: any) { // Add : any for error type consistency
            console.error("Error retrieving categories:", error); // Add console.error
            res.status(500).json({ 
                message: "Error retrieving categories", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    }
    export const getCategoryByIdHandler = async (req: Request, res: Response) => {
        try {
            const categoryId = req.params.id;
            const category = await CategoryService.getCategoryById(categoryId);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
            res.status(200).json({ message: "Category retrieved successfully", data: category });
        } catch (error: any) { // Add : any for error type consistency
            console.error("Error retrieving category:", error); // Add console.error
            res.status(500).json({ 
                message: "Error retrieving category", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    }
    export const createCategoryHandler = async (req: Request, res: Response) => {
        try {
            const parsedData = CreateCategorySchema.parse(req.body); // Use Zod for validation
            const newCategory = await CategoryService.createCategory(parsedData); // Pass parsed data
            res.status(201).json({ message: "Category created successfully", data: newCategory });
        } catch (error: any) { // Add : any for error type consistency
            console.error("Error creating category:", error); // Add console.error
            res.status(400).json({ 
                message: "Error creating category", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    }
    export const updateCategoryHandler = async (req: Request, res: Response) => {
        try {
            const categoryId = req.params.id;
            const parsedData = UpdateCategorySchema.parse(req.body); // Use Zod for validation
            const updatedCategory = await CategoryService.updateCategory(categoryId, parsedData); // Pass parsed data
            res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
        } catch (error: any) { // Add : any for error type consistency
            console.error("Error updating category:", error); // Add console.error
            res.status(400).json({ 
                message: "Error updating category", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    }
    export const deleteCategoryHandler = async (req: Request, res: Response) => {
        try {
            const categoryId = req.params.id;
            const deletedCategory = await CategoryService.deleteCategory(categoryId);
            res.status(200).json({ message: "Category deleted successfully", data: deletedCategory });
        } catch (error: any) { // Add : any for error type consistency
            console.error("Error deleting category:", error); // Add console.error
            res.status(400).json({ 
                message: "Error deleting category", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    }
}