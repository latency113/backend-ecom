import { CategoryRepository } from "@/feature/repositories/category/category.repository";
import { CategorySchema } from "./category.schema";

export namespace CategoryService {
    export const getAllCategories = async () => {
        const categories = await CategoryRepository.getAllCategories();
        return categories.map(category => CategorySchema.parse(category));
    }

    export const getCategoryById = async (id: string) => {
        const category = await CategoryRepository.getCategoryById(id);
        if (!category) return null;
        return CategorySchema.parse(category);
    }

    export const createCategory = async (data: { name: string; description?: string }) => {
        const newCategory = await CategoryRepository.createCategory(data);
        return CategorySchema.parse(newCategory);
    }

    export const updateCategory = async (id: string, data: { name?: string; description?: string }) => {
        const updatedCategory = await CategoryRepository.updateCategory(id, data);
        return CategorySchema.parse(updatedCategory);
    }

    export const deleteCategory = async (id: string) => {
        const deletedCategory = await CategoryRepository.deleteCategory(id);
        return CategorySchema.parse(deletedCategory);
    }
}