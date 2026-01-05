import prisma from "@/providers/database/database.provider";
import { CategorySchema, CreateCategory, UpdateCategory } from "@/feature/services/category/category.schema";

export namespace CategoryRepository {
    export const getAllCategories = async () => {
        const categories = await prisma.category.findMany();
        return categories.map(category => CategorySchema.parse(category));
    }
    
    export const getCategoryById = async (id: string) => {
        const category = await prisma.category.findUnique({
            where: { id },
            include: { products: true },
        });
        return category ? CategorySchema.parse(category) : null;
    }
    export const createCategory = async (data: CreateCategory) => {
        const newCategory = await prisma.category.create({
            data,
        });
        return CategorySchema.parse(newCategory);
    }
    export const updateCategory = async (id: string, data: UpdateCategory) => {
        const updatedCategory = await prisma.category.update({
            where: { id },
            data,
        });
        return CategorySchema.parse(updatedCategory);
    }
    export const deleteCategory = async (id: string) => {
        const deletedCategory = await prisma.category.delete({
            where: { id },
        });
        return CategorySchema.parse(deletedCategory);
    }
}