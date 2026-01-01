import { Express ,Request,Response} from "express";
import { CategoryService } from "@/feature/services/category/category.service";

export namespace CategoryController {
    export const getAllCategoriesHandler = async (req: Request, res: Response) => {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json({ message: "Categories retrieved successfully", data: categories });
        } catch (error) {
            res.status(500).json({ message: "Error retrieving categories", error });
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
        } catch (error) {
            res.status(500).json({ message: "Error retrieving category", error });
        }
    }
    export const createCategoryHandler = async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body;
            const newCategory = await CategoryService.createCategory({ name, description });
            res.status(201).json({ message: "Category created successfully", data: newCategory });
        } catch (error) {
            res.status(400).json({ message: "Error creating category", error });
        }
    }
    export const updateCategoryHandler = async (req: Request, res: Response) => {
        try {
            const categoryId = req.params.id;
            const { name, description } = req.body;
            const updatedCategory = await CategoryService.updateCategory(categoryId, { name, description });
            res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
        } catch (error) {
            res.status(400).json({ message: "Error updating category", error });
        }
    }
    export const deleteCategoryHandler = async (req: Request, res: Response) => {
        try {
            const categoryId = req.params.id;
            const deletedCategory = await CategoryService.deleteCategory(categoryId);
            res.status(200).json({ message: "Category deleted successfully", data: deletedCategory });
        } catch (error) {
            res.status(400).json({ message: "Error deleting category", error });
        }
    }
}