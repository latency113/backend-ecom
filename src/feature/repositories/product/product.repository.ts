import prisma from "@/providers/database/database.provider";

export namespace ProductRepository {
    export const getAllProducts = async () => {
        return await prisma.product.findMany();
    }

    export const getProductById = async (id: string) => {
        return await prisma.product.findUnique({
            where: { id },
        });
    }

    export const createProduct = async (data: { name: string; description?: string; price: number; stock?: number; imgUrl?: string; categoryId: string }) => {
        return await prisma.product.create({
            data,
        });
    }

    export const updateProduct = async (id: string, data: { name?: string; description?: string; price?: number; stock?: number; imgUrl?: string; categoryId?: string }) => {
        return await prisma.product.update({
            where: { id },
            data,
        });
    }

    export const deleteProduct = async (id: string) => {
        return await prisma.product.delete({
            where: { id },
        });
    }
}